require_relative "../src/models/game"
require_relative '../src/models/order'
require_relative '../src/adjudicator'
require "test/unit"
 
class TestAdjudicator < Test::Unit::TestCase

  def setup
    @game = Game.new([])
  end

  def test_hold_simple_succeeds
    orders = [Order.new("Russia", "A", "MOS", "H", "MOS", "", "", "", "")]
    Adjudicator.new(@game.territories, orders)

    assert_equal('succeeds', orders.first.resolution )
  end
 
  def test_direct_army_simple_succeeds
    orders = [Order.new("Russia", "A", "MOS", "M", "UKR", "", "", "", "")]
    Adjudicator.new(@game.territories, orders)

    assert_equal('succeeds', orders.first.resolution )
  end

  def test_indirect_no_convoy_fails
    orders = [Order.new("Russia", "A", "MOS", "M", "BOH", "", "", "", "")]
    Adjudicator.new(@game.territories, orders)

    assert_equal('fails', orders.first.resolution )
  end

  def test_direct_army_to_water_fails
    orders = [Order.new("Russia", "A", "LVN", "M", "GOB", "", "", "", "")]
    Adjudicator.new(@game.territories, orders)

    assert_equal('fails', orders.first.resolution )
  end

  def test_direct_fleet_simple_succeeds
    orders = [Order.new("Russia", "F", "BAL", "M", "GOB", "", "", "", "")]
    Adjudicator.new(@game.territories, orders)

    assert_equal('succeeds', orders.first.resolution )
  end

  def test_direct_fleet_to_coast_simple_succeeds
    orders = [Order.new("Russia", "F", "BAL", "M", "PRU", "", "", "", "")]
    Adjudicator.new(@game.territories, orders)

    assert_equal('succeeds', orders.first.resolution )
  end

  def test_direct_fleet_from_coast_simple_succeeds
    orders = [Order.new("Russia", "F", "PRU", "M", "BAL", "", "", "", "")]
    Adjudicator.new(@game.territories, orders)

    assert_equal('succeeds', orders.first.resolution )
  end

  def test_direct_fleet_to_land_fails
    orders = [Order.new("Russia", "F", "PRU", "M", "WAR", "", "", "", "")]
    Adjudicator.new(@game.territories, orders)

    assert_equal('fails', orders.first.resolution )
  end
 
end