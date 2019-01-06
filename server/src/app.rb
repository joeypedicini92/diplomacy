require 'dotenv/load'
require 'sinatra'
require 'sinatra/json'
require 'jwt'
require 'net/http'
require_relative 'models/player'
require_relative 'models/game'
require_relative 'adjudicator'
require_relative 'models/order'
require 'rufus-scheduler'

def initialize
  super()
  @Game = Game.new()
end

def startGame
  @scheduler = Rufus::Scheduler.new
  # @scheduler.every '10s' do
    # puts @Game.territories.length
    # @adjudicator = Adjudicator.new(@Game.territories, @Game.orders)
  # end
end

get '/' do
  startGame()
end

post '/sign-up' do
  if(@Game.players.length === 7) then
    halt 400, 'Queue is already full! Please wait for next game.'
  end

  request.body.rewind
  data = JSON.parse request.body.read

  if(@Game.players.find {|player| player.id === data['user-id']}) then
    halt 400, 'Player id already taken!'
  end

  newPlayer = Player.new(data['user-id'])
  @Game.addPlayer(newPlayer)

  if(@Game.players.length === 7) then
    startGame()
  end

  "Hello #{@Players.last.id}! You have been added to the game queue and the game will start once all 7 players are confirmed."
end

post '/orders' do
  request.body.rewind
  data = JSON.parse request.body.read

  # remove already submitted orders
  @Game.orders.each do |o|
    if(o.country == data['country']) then
      @Game.deleteOrder(o)
    end
  end

  # add new orders
  data['orders'].each do |d|
    @Game.addOrder(Order.new(data['country'], d['unit'], d['territory'], d['type'], d['moveTerritory'], d['supportUnit'], d['supportType'], d['supportTerritory'], d['supportToTerritory']))
  end

  "Submitted #{data['orders'].length} orders."
end

def verifyAccess(request)
  auth = request.env["HTTP_AUTHORIZATION"]
  token = auth.split(' ')[1]
  decoded_token = JWT.decode token, nil, false
  kid = decoded_token[1]['kid']
  alg = decoded_token[1]['alg']
  exp = decoded_token[0]['exp']
  iat = decoded_token[0]['iat']
  aud = decoded_token[0]['aud']
  iss = decoded_token[0]['iss']
  sub = decoded_token[0]['sub']
  auth_time = decoded_token[0]['auth_time']

  begin  # "try" block
    resp = Net::HTTP.get(URI('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'))
    certs = JSON.parse resp
    cert = OpenSSL::X509::Certificate.new(certs[kid])
    public_key = cert.public_key
    JWT.decode token, public_key, true, { algorithm: 'RS256' }
  rescue # optionally: `rescue Exception => ex`
    return false
  ensure # will always get executed
    puts '401 bad token'
  end 

  if(
    exp > Time.now.to_i \
    && iat < Time.now.to_i \
    && aud == 'diplomacy-1f590' \
    && iss == 'https://securetoken.google.com/diplomacy-1f590' \
    && auth_time < Time.now.to_i
  ) then
    return sub
  end
    # && @Game.players.find {|p| p.id == sub} \
  return false
end

get '/current-orders' do
  userId = verifyAccess(request)
  if(userId) then
    userId
  else
    halt 401, 'Failed Authentication'
  end
end