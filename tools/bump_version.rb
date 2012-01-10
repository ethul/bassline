require "json"

PACKAGE_JSON = "package.json"

def valid? version
  if not version.nil? and /\d+\.\d+\.\d+/.match(version) then true
  else false end
end

version = ARGV.shift
if not valid? version then puts "Invalid, please specify a version x.y.z"
else
  json = JSON.parse IO.read(PACKAGE_JSON)
  json["version"] = version
  File.open(PACKAGE_JSON,"w") {|f| f.puts JSON.pretty_generate(json)}
end
