class Adjudicator
  def initialize(territories, orders)
    @FAILS = 'fails'
    @SUCCEEDS = 'succeeds'

    @UNRESOLVED = 'unresolved'
    @GUESSING = 'guessing'
    @RESOLVED = 'resolved'

    @dep_list = []
    @nr_of_dep = 0
    @territories = territories
    @orders = orders
    orders.each do |o|
      resolve(o)
    end
  end

  def backup_rule(nr_of_dep)
    @dep_list[--nr_of_dep].state = @RESOLVED
    @dep_list[--nr_of_dep].resolution = @SUCCEEDS
  end

  def adjudicate(order)
    t = getTerritoryById(order.territory)
    t2 = getTerritoryById(order.moveTerritory)
    h2hOrder = @orders.find {|o| o.moveTerritory === order.territory}
    moveTerritory = getTerritoryById(order.moveTerritory)
    competeOrders = @orders.select do |o| 
      o.moveTerritory === order.moveTerritory \
      && o.territory != order.territory
    end

    if(order.type === 'H') then
      t.setHoldStrength(calculateMoveStrength(order))
      order.setDefendStrength(calculateDefendStrength(order))
      order.setPreventStrength(calculatePreventStrength(order))
      if(beatsAttacks(moveTerritory, competeOrders)) then
        order.setState @RESOLVED
        order.setResolution @SUCCEEDS
      else
        order.setState @RESOLVED
        order.setResolution @FAILS
      end
    end
    if(order.type === 'M') then
      if(isValidMove(order, t, t2)) then
        buildPath(order, t, t2)
        order.setDefendStrength(calculateDefendStrength(order))
        order.setPreventStrength(calculatePreventStrength(order))
        if(h2hOrder) then
          #     In case of a head-to-head battle, the move succeeds when the attack strength is larger then the defend strength of the opposing unit and larger than the prevent strength of any unit moving to the same area. If one of the opposing strengths is equal or greater, then the move fails.
          h2hOrder.setDefendStrength(calculateDefendStrength(h2hOrder))
          h2hOrder.setPreventStrength(calculatePreventStrength(h2hOrder))

          if(order.attackStrength > h2hOrder.defendStrength && beatsPrevents(order, competeOrders)) then
            order.setState @RESOLVED
            order.setResolution @SUCCEEDS
          else
            order.setState @RESOLVED
            order.setResolution @FAILS
          end
        else
          # If there is no head-to-head battle, the move succeeds when the attack strength is larger then the hold strength of the destination and larger than the prevent strength of any unit moving to the same area. If one of the opposing strengths is equal or greater, then the move fails.
          if(order.attackStrength > moveTerritory.holdStrength && beatsPrevents(order, competeOrders)) then
            order.setState @RESOLVED
            order.setResolution @SUCCEEDS
          else
            order.setState @RESOLVED
            order.setResolution @FAILS
          end
        end
      else
        order.setState(@RESOLVED)
        order.setResolution(@FAILS)
      end
    end
    if(order.type === 'C') then
      orderForConvoyTerritory = @orders.find {|o| o.territory === order.supportTerritory}
      if(isValidConvoy(order, orderForConvoyTerritory)) then
        t.setHoldStrength(calculateMoveStrength(order))
        order.setDefendStrength(calculateDefendStrength(order))
        order.setPreventStrength(calculatePreventStrength(order))
        if(beatsAttacks(moveTerritory, competeOrders)) then
          order.setState @RESOLVED
          order.setResolution @SUCCEEDS
        else
          order.setState @RESOLVED
          order.setResolution @FAILS
        end
      else
        order.setState @RESOLVED
        order.setResolution @FAILS
      end
    end
    if(order.type === 'S') then
      orderForSupportTerritory = @orders.find {|o| o.territory === order.supportTerritory}
      if(isValidSupport(order, orderForSupportTerritory)) then
        t.setHoldStrength(calculateMoveStrength(order))
        order.setDefendStrength(calculateDefendStrength(order))
        order.setPreventStrength(calculatePreventStrength(order))
        if(beatsAttacks(moveTerritory, competeOrders)) then
          order.setState @RESOLVED
          order.setResolution @SUCCEEDS
        else
          order.setState @RESOLVED
          order.setResolution @FAILS
        end
      end
    end
    return order.resolution
  end

  def beatsAttacks(territory, competeOrders)
    competeOrders.each do |c|
      if (c.attackStrength > territory.holdStrength) then 
        return false
      end
    end
    return true
  end

  def beatsPrevents(order, competeOrders)
    competeOrders.each do |c|
      if (c.preventStrength >= order.attackStrength) then 
        return false
      end
    end
    return true
  end

  def buildPath(order, t, t2)
    orderForMoveTerritory = @orders.find {|o| o.territory === order.moveTerritory}
    if(orderForMoveTerritory && isSameNationalityAttack(order, orderForMoveTerritory)) then
      order.setAttackStrength(0)
    end
    if(t.neighbors.include? order.moveTerritory ) then
      # direct move
      order.setAttackStrength(calculateMoveStrength(order))
    else
      # indirect move (convoy)
      convoys = @orders.select {|o| isValidConvoy(o, order) }
      convoys.each do |c|
        resolve(c)
      end
      isValid = getValidConvoyPath(convoys, t, t2)
      validConvoys = convoys.select {|c| c.visited}
      if(!isValid || validConvoys.find {|f| f.resolution == @FAILS}) then
        order.setState @RESOLVED
        order.setResolution @FAILS
      else
        order.setAttackStrength(calculateMoveStrength(order))
      end
    end
  end

  def isValidConvoy(o, order)
    return order && o.type == 'C' \
    && o.unit == 'F' \
    && o.supportUnit == 'A' \
    && o.supportTerritory == order.territory \
    && o.supportToTerritory == order.moveTerritory \
    && getTerritoryById(o.territory).type == 'w'
  end

  def getValidConvoyPath(convoys, start, endT)
    startConvoys = convoys.select {|c| start.neighbors.include? c.territory }
    remainingConvoys = convoys - startConvoys
    valid = false
    startConvoys.each do |c|
      if(c.resolution == @SUCCEEDS) then
        c.setVisited()
      else
        return false
      end
      if(remainingConvoys.length == 0) then
        # we're at the end, check if we're adjacent to the end
        if(endT.neighbors.include? c.territory ) then
          # this path is valid
          return true
        else
          c.removeVisited()
          return false
        end
      else
        valid = getValidConvoyPath(remainingConvoys, getTerritoryById(c.territory), endT)
        if(!valid) then
          c.removeVisited()
        end
      end
    end
    return valid
  end

  def isSameNationalityAttack(fromOrder, toOrder)
    return fromOrder.country == toOrder.country \
    && ( \
      ( \
        toOrder.type == 'M' \
        && !resolve(toOrder) \
      ) || \
      ( \
        toOrder.type != 'M' \
        && resolve(toOrder) \
      ) \
    )
  end

  def getTerritoryById(id)
    return @territories.find {|t| t.id === id}
  end

  def calculatePreventStrength(order)
    strength = 1
    if(order.resolution == @FAILS) then
      return 0
    end
    @orders.each do |o|
      if(isValidSupport(o, order)) then
        if(resolve(o)) then
          ++strength
        end
      end
    end
    return strength
  end

  def calculateDefendStrength(order)
    strength = 1
    @orders.each do |o|
      if(isValidSupport(o, order)) then
        if(resolve(o)) then
          ++strength
        end
      end
    end
    return strength
  end

  def calculateMoveStrength(order)
    strength = 1
    @orders.each do |o|
      if(isValidSupport(o, order)) then
        orderBeingAttacked = @orders.find {|o| o.territory == order.moveTerritory}
        if(orderBeingAttacked && orderBeingAttacked.country == o.country) then
          # do nothing
        elsif(resolve(o)) then
          ++strength
        end
      end
    end
    return strength
  end

  def isValidSupport(o, receivingOrder)
    t = getTerritoryById(o.territory)
    return o.type == 'S' \
    && t.neighbors.include?(o.supportToTerritory)  \
    && isValidMoveForUnit(o.unit, o.supportToTerritory) \
    && o.supportUnit == receivingOrder.unit \
    && o.supportTerritory == receivingOrder.territory \
    && o.supportToTerritory == receivingOrder.moveTerritory
  end

  def isValidMoveForUnit(unit, territory)
    t = getTerritoryById(territory)
    return unit == 'A' && ['l','c'].include?(t.type) \
    || unit == 'F' && ['w','c'].include?(t.type)
  end 

  def isValidMove(o, fromTerritory, toTerritory)
    return (
      o.unit == 'A' && ['l','c'].include?(toTerritory.type) \
      || o.unit == 'F' && ['w','c'].include?(toTerritory.type)
    ) \
    && fromTerritory.id == o.territory
  end

  def resolve(order)
    if(order.state == @RESOLVED) then
      return order.resolution
    end
    if(order.state == @GUESSING) then
      i = 0
      while (i < @nr_of_dep)
        if(@dep_list[++i] == order) then
          return order.resolution
        end
      end
      @dep_list[++@nr_of_dep] = order
      return order.resolution
    end

    old_nr_of_dep = @nr_of_dep

    order.setResolution(@FAILS)
    order.setState(@GUESSING)

    first_result = adjudicate(order)
    if(@nr_of_dep == old_nr_of_dep) then
      if(order.state != @RESOLVED) then
        order.setResolution first_result
        order.setState @RESOLVED
      end
    end
    if(@dep_list[old_nr_of_dep] != order) then
      @dep_list[++@nr_of_dep] = order
      order.setResolution(first_result)
      return first_result
    end
    while(@nr_of_dep > old_nr_of_dep)
      @dep_list[--@nr_of_dep].state = @UNRESOLVED
    end
    order.setResolution @SUCCEEDS
    order.setState @GUESSING
    second_result = adjudicate(order)
    if(first_result == second_result) then
      while(@nr_of_dep > old_nr_of_dep)
        @dep_list[--@nr_of_dep].state = @UNRESOLVED
      end
      order.setResolution first_result
      order.setState @RESOLVED
      return first_result
    end

    backup_rule(old_nr_of_dep)

    return resolve(nr)
  end
end