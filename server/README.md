# Joey's Diplomacy Server!

## Setup
* `gem install`
* `ruby app.rb`
* `http://localhost:4567/`

## Notes
* Based on [The Math of Adjudication by Lucas Kruijswijk
](http://uk.diplom.org/pouch/Zine/S2009M/Kruijswijk/DipMath_Chp1.htm)
* Need to tweak the code to handle territories with coasts
* More tests


## API Documentation

```
		○ POST /sign-up	{
			  user-id: "jped92",
			  ???
			}
		GET/join-game/{player}	Add player to game queue.
			Once queue reaches 7, start game
			For now, if game in progress return error status
		POST /{player}/orders	[{
			  unit: "A | F",
			  territory: "Mos | Bud | etc...",
			  order: "H | S | C | M",
			  move-territory: "Mos | Bud | etc...",
			  support-unit: "A | F",
			  support-order: "H | M",
			  support-territory: "Mos | Bud | etc...",
			  support-to-territory: "Mos | Bud | etc..."
			}...]
		POST /{player}/retreats	[{  unit: "A | F",
			  territory: "Mos | Bud | etc...",
			  retreat-territory: "Mos | Bud | etc..."}...]
		POST /{player}/builds	[{  order: "B | D",
			  unit: "A | F",
			  territory: "Mos | Bud | etc..."}...]
		GET /orders/{year}/{phase}	[{  player: "italy",
			  orders: [...]}...]
		If no year/phase set do current
		GET /positions/{year}/{phase}	[{  player: "italy",
			  supply-centers: ["Mos", "Bud"],
		If no year/phase set do current	  units: [
			    { territory: "Mos", unit: "A" },
			    { territory: "Bud", unit: "F" }
			  ]}...]
		POST /message	{  chat_id: 1823723,
			  message: "blahblahblah..."}
		POST /chat	{
			  participants: ["germany", "france"]
			}
		GET /chats	[{
			  id: 13823748,  participants: ["germany", "france"],
			  last_message: 20181230T12:30:34.000Z,
			  unread_messages: 3}...]
		GET /chat/{id}	[{  from: "italy",
			  message: "blahblahblah...",
			  timestamp: 20181230T12:30:34.000Z}...]

```