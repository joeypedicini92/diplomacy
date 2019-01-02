class Order
  def initialize(country, unit, territory, order, moveTerritory, supportUnit, supportOrder, supportTerritory, supportToTerritory)
    @country = country
    @unit = unit
    @territory = territory
    @type = order
    @moveTerritory = moveTerritory
    @supportUnit = supportUnit
    @supportOrder = supportOrder
    @supportTerritory = supportTerritory
    @supportToTerritory = supportToTerritory
  end

  def unit
    @unit
  end

  def territory
    @territory
  end

  def type
    @type
  end

  def moveTerritory
    @moveTerritory
  end

  def supportUnit
    @supportUnit
  end

  def supportOrder
    @supportOrder
  end

  def supportTerritory
    @supportTerritory
  end

  def supportToTerritory
    @supportToTerritory
  end

  def country
    @country
  end

  def state
    @state
  end

  def resolution
    @resolution
  end

  def setResolution(r)
    if(r == 'fails') then
      self.setAttackStrength 0
    end
    @resolution = r
  end

  def setState(s)
    @state = s
  end
    
  def attackStrength
    @attackStrength
  end

  def defendStrength
    @defendStrength
  end

  def preventStrength
    @preventStrength
  end

  def setDefendStrength(s)
    @defendStrength = s || 0
  end

  def setAttackStrength(s)
    @attackStrength = s || 0
  end

  def setPreventStrength(s)
    @preventStrength = s || 0
  end


end