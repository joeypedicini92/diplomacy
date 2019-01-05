class Territory
  def initialize(id, type, sc, neighbors, fleetRestrictions, country)
    @id = id
    @type = type
    @points = sc
    @neighbors = neighbors
    @fleetRestrictions = fleetRestrictions || []
    @country = country
    @holdStrength = 0
  end

  def id
    @id
  end

  def type
    @type
  end

  def points
    @points
  end

  def neighbors
    @neighbors
  end

  def fleetRestrictions
    @fleetRestrictions
  end

  def country
    @country
  end

  def unit
    @unit
  end

  def order
    @order
  end

  def holdStrength
    @holdStrength
  end

  def setHoldStrength(s)
    @holdStrength = s || 0
  end

  def setStatus(country, unit)
    @unit = unit
    @country = country
  end

  def setCountry(c)
    @country = c
  end

end