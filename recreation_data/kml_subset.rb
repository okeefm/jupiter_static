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

centroid_loc = [42.237228, -73.772507]

file = File.open( ARGV[0] )

doc = Nokogiri::XML(file)

trails = {}

doc.css("Placemark").each { |elem| 
	lats = elem.css("Point coordinates").text.split(",")
	name = elem.css("name").text
	if distance(centroid_loc, [lats[1].to_f, lats[0].to_f]) > 100 then
		elem.remove
	else
		if !trails.has_key?(name)
			trails[name] = elem
		else
			elem.remove
		end
	end
}

puts doc.to_xml

file.close
