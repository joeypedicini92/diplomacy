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

  def test_direct_army_to_coast_succeeds
    orders = [Order.new("Russia", "A", "LVN", "M", "PRU", "", "", "", "")]
    Adjudicator.new(@game.territories, orders)

    assert_equal('succeeds', orders.first.resolution )
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

  def test_indirect_army_simple_succeeds
    orders = [
      Order.new("Russia", "A", "PRU", "M", "DEN", "", "", "", ""),
      Order.new("Russia", "F", "BAL", "C", "BAL", "A", "M", "PRU", "DEN")
    ]
    Adjudicator.new(@game.territories, orders)

    assert_equal('succeeds', orders.first.resolution )
    assert_equal('succeeds', orders.last.resolution )
  end

  def test_indirect_army_simple_succeeds_reverse_order
    orders = [
      Order.new("Russia", "F", "BAL", "C", "BAL", "A", "M", "PRU", "DEN"),
      Order.new("Russia", "A", "PRU", "M", "DEN", "", "", "", "")
    ]
    Adjudicator.new(@game.territories, orders)

    assert_equal('succeeds', orders.first.resolution )
    assert_equal('succeeds', orders.last.resolution )
  end

  def test_indirect_army_two_convoys_succeeds
    orders = [
      Order.new("Russia", "F", "BAL", "C", "BAL", "A", "M", "PRU", "FIN"),
      Order.new("Russia", "F", "GOB", "C", "GOB", "A", "M", "PRU", "FIN"),
      Order.new("Russia", "A", "PRU", "M", "FIN", "", "", "", "")
    ]
    Adjudicator.new(@game.territories, orders)

    assert_equal('succeeds', orders[0].resolution )
    assert_equal('succeeds', orders[1].resolution )
    assert_equal('succeeds', orders[2].resolution )
  end

  def test_indirect_army_wrong_convoy_fails
    orders = [
      Order.new("Russia", "F", "GOB", "C", "GOB", "A", "M", "PRU", "FIN"),
      Order.new("Russia", "A", "PRU", "M", "FIN", "", "", "", "")
    ]
    Adjudicator.new(@game.territories, orders)

    assert_equal('succeeds', orders[0].resolution )
    assert_equal('fails', orders[1].resolution )
  end

  def test_convoying_a_fleet_fails
    orders = [
      Order.new("Russia", "F", "GOB", "C", "GOB", "F", "M", "PRU", "DEN"),
      Order.new("Russia", "F", "PRU", "M", "DEN", "", "", "", "")
    ]
    Adjudicator.new(@game.territories, orders)

    assert_equal('fails', orders[0].resolution )
    assert_equal('fails', orders[1].resolution )
  end

  def test_army_convoy_fails
    orders = [
      Order.new("Russia", "A", "GOB", "C", "GOB", "A", "M", "PRU", "DEN"),
      Order.new("Russia", "A", "PRU", "M", "DEN", "", "", "", "")
    ]
    Adjudicator.new(@game.territories, orders)

    assert_equal('fails', orders[0].resolution )
    assert_equal('fails', orders[1].resolution )
  end

  def test_convoying_from_coast_fails
    orders = [
      Order.new("Russia", "F", "PRU", "C", "PRU", "A", "M", "BER", "LVN"),
      Order.new("Russia", "A", "BER", "M", "LVN", "", "", "", "")
    ]
    Adjudicator.new(@game.territories, orders)

    assert_equal('fails', orders[0].resolution )
    assert_equal('fails', orders[1].resolution )
  end

  def test_convoy_not_matching_fails
    orders = [
      Order.new("Russia", "F", "BAL", "C", "BAL", "A", "M", "PRU", "LVN"),
      Order.new("Russia", "A", "BER", "M", "LVN", "", "", "", "")
    ]
    Adjudicator.new(@game.territories, orders)

    assert_equal('fails', orders[0].resolution )
    assert_equal('fails', orders[1].resolution )
  end

  def test_simple_support_succeeds
    orders = [
      Order.new("Russia", "A", "PRU", "S", "PRU", "A", "H", "BER", "BER"),
      Order.new("Russia", "A", "BER", "H", "BER", "", "", "", "")
    ]
    Adjudicator.new(@game.territories, orders)

    assert_equal('succeeds', orders[0].resolution )
    assert_equal('succeeds', orders[1].resolution )
  end

  def test_fleet_support_coast_succeeds
    orders = [
      Order.new("Russia", "F", "BAL", "S", "BAL", "A", "H", "BER", "BER"),
      Order.new("Russia", "A", "BER", "H", "BER", "", "", "", "")
    ]
    Adjudicator.new(@game.territories, orders)

    assert_equal('succeeds', orders[0].resolution )
    assert_equal('succeeds', orders[1].resolution )
  end

  def test_support_not_adjacent_from_succeeds
    orders = [
      Order.new("Russia", "F", "GOB", "S", "GOB", "A", "M", "PRU", "LVN"),
      Order.new("Russia", "A", "PRU", "M", "LVN", "", "", "", "")
    ]
    Adjudicator.new(@game.territories, orders)

    assert_equal('succeeds', orders[0].resolution )
    assert_equal('succeeds', orders[1].resolution )
  end

  def test_support_not_adjacent_to_fails
    orders = [
      Order.new("Russia", "F", "KIE", "S", "KIE", "A", "M", "BER", "PRU"),
      Order.new("Russia", "A", "BER", "M", "PRU", "", "", "", "")
    ]
    Adjudicator.new(@game.territories, orders)

    assert_equal('fails', orders[0].resolution )
    assert_equal('succeeds', orders[1].resolution )
  end

  def test_army_support_water_fails
    orders = [
      Order.new("Russia", "F", "BAL", "H", "BAL", "", "", "", ""),
      Order.new("Russia", "A", "BER", "S", "BER", "F", "H", "BAL", "BAL")
    ]
    Adjudicator.new(@game.territories, orders)

    assert_equal('succeeds', orders[0].resolution )
    assert_equal('fails', orders[1].resolution )
  end

  def test_support_convoy_simple_succeeds
    orders = [
      Order.new("Russia", "F", "BAL", "C", "BAL", "A", "M", "PRU", "SWE"),
      Order.new("Russia", "F", "GOB", "S", "GOB", "A", "M", "PRU", "SWE"),
      Order.new("Russia", "A", "PRU", "M", "SWE", "", "", "", "")
    ]
    Adjudicator.new(@game.territories, orders)

    assert_equal('succeeds', orders[0].resolution )
    assert_equal('succeeds', orders[1].resolution )
    assert_equal('succeeds', orders[2].resolution )
  end

  def test_support_convoying_fleet_simple_succeeds
    orders = [
      Order.new("Russia", "F", "BAL", "C", "BAL", "A", "M", "PRU", "SWE"),
      Order.new("Russia", "F", "GOB", "S", "GOB", "F", "H", "BAL", "BAL"),
      Order.new("Russia", "A", "PRU", "M", "SWE", "", "", "", "")
    ]
    Adjudicator.new(@game.territories, orders)

    assert_equal('succeeds', orders[0].resolution )
    assert_equal('succeeds', orders[1].resolution )
    assert_equal('succeeds', orders[2].resolution )
  end

  def test_support_failed_convoy_succeeds
    orders = [
      Order.new("Russia", "F", "BAL", "C", "BAL", "A", "M", "PRU", "SWE"),
      Order.new("Russia", "F", "GOB", "S", "GOB", "F", "H", "BAL", "BAL")
    ]
    Adjudicator.new(@game.territories, orders)

    assert_equal('fails', orders[0].resolution )
    assert_equal('succeeds', orders[1].resolution )
  end

  def test_support_failed_convoy_move_succeeds
    orders = [
      Order.new("Russia", "F", "GOB", "S", "GOB", "A", "M", "PRU", "SWE"),
      Order.new("Russia", "A", "PRU", "M", "SWE", "", "", "", "")
    ]
    Adjudicator.new(@game.territories, orders)

    assert_equal('succeeds', orders[0].resolution )
    assert_equal('fails', orders[1].resolution )
  end

  def test_head_to_head_even_both_fail
    orders = [
      Order.new("Russia", "A", "BER", "M", "PRU", "", "", "", ""),
      Order.new("Russia", "A", "PRU", "M", "BER", "", "", "", "")
    ]
    Adjudicator.new(@game.territories, orders)

    assert_equal('fails', orders[0].resolution )
    assert_equal('fails', orders[1].resolution )
  end
 
end