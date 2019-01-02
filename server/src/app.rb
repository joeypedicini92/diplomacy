require 'dotenv/load'
require 'sinatra'
require 'sinatra/json'
require_relative 'models/player'
require_relative 'models/game'
require_relative 'adjudicator'
require_relative 'models/order'
require 'rufus-scheduler'

def initialize
  super()
  @Players = []
end

def startGame
  @scheduler = Rufus::Scheduler.new
  @Game = Game.new(@Players)
  order = Order.new("Russia", "A", "MOS", "M", "UKR", "", "", "", "")
  @orders = [order]
  # @scheduler.every '10s' do
    puts @Game.territories.length
    @adjudicator = Adjudicator.new(@Game.territories, @orders)
  # end
end

get '/' do
  startGame()
  puts @orders.first.resolution
end

post '/sign-up' do
  if(@Players.length === 7) then
    halt 400, 'Queue is already full! Please wait for next game.'
  end

  request.body.rewind
  data = JSON.parse request.body.read

  if(@Players.find {|player| player.id === data['user-id']}) then
    halt 400, 'Player id already taken!'
  end

  newPlayer = Player.new(data['user-id'])
  @Players << newPlayer

  if(@Players.length === 7) then
    startGame()
  end

  "Hello #{@Players.last.id}! You have been added to the game queue and the game will start once all 7 players are confirmed."
end