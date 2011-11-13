require "github/markup"

TOOLS = "tools"
MODULE = "module"
SRC = "lib"
EXT = "js"
BASS = "bass"
README = "README.md"
TEST = "README.html"

File.open(README, "w") do |file|
  file.puts IO.readlines("#{TOOLS}/#{MODULE}.#{EXT}").
  select {|a| a.match /\A\s*("#{BASS}|,)/}.
  map {|a| "#{SRC}/#{a.gsub /[",\s]+/,""}.#{EXT}"}.
  unshift("#{TOOLS}/#{MODULE}.#{EXT}").
  reduce([]) {|b,file|
    b << IO.readlines(file).
    select {|a| a.match /\A\s*\/\//}.
    map {|a| a.sub /\A\s*\/\/\s?/, ""}.
    join("")
  }.
  join("\n")
end

# run the readme through the github markup library to see how it looks before committing
File.open(TEST, "w") do |file|
  file.puts GitHub::Markup.render(README)
end
