require 'nokogiri'

class Numeric
    def to_rad
      self * Math::PI / 180
    end
  end
 
  # http://www.movable-type.co.uk/scripts/latlong.html
  # loc1 and loc2 are arrays of [latitude, longitude]
  def distance loc1, loc2
     lat1, lon1 = loc1
     lat2, lon2 = loc2
     dLat = (lat2-lat1).to_rad;
     dLon = (lon2-lon1).to_rad;
     a = Math.sin(dLat/2) * Math.sin(dLat/2) +
         Math.cos(lat1.to_rad) * Math.cos(lat2.to_rad) *
         Math.sin(dLon/2) * Math.sin(dLon/2);
     c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
     d = 6371 * c; # Multiply by 6371 to get Kilometers
  end

centroid_loc = [42.659054, -73.756027]

file = File.open( ARGV[0] )

doc = Nokogiri::XML(file)

doc.css("Placemark").each |elem| do
	lats = elem.css("Point coordinates").split(",").to_i
	if distance(centroid_loc, [lats[0], lats[1]]) > 150 then
		elem.remove
	end
end

file.close
