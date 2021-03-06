require 'csv'
require_relative 'territory'

class Game
  def initialize()
    @chats = []
    @orders = []
    @players = []
    @year = 1901
    @phase = self.phases.first
    @territories = []
    CSV.foreach("assets/territories.csv") do |row|
      @territories << Territory.new(row[0], row[1], row[2], row[3], row[4], row[5])
    end
  end

  def players
    @players
  end

  def chats
    @chats
  end

  def year
    @year
  end

  def phase
    @phase
  end

  def territories
    @territories
  end

  def orders
    @orders
  end

  def phases
    ['Spring', 'Spring Retreat', 'Fall', 'Fall Retreat', 'Winter']
  end

  def countries
    ['England', 'France', 'Germany', 'Italy', 'Austria/Hungary', 'Ottoman Empire', 'Russia']
  end

  def addOrder(order)
    @orders << order
  end

  def removeOrder(order)
    @orders.delete(order)
  end

  def addPlayer(player)
    @players << player
  end
end