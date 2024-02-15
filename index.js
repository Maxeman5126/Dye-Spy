module.exports = function color(m) {
	const MSG = new TeraMessage(m);
	let enabled = false;
	m.command.add("color", () => {
		enabled = !enabled;
		m.command.message(`mod ${enabled?'en':'dis'}abled.`);
	});
	
	m.hook("S_SHOW_ITEM_TOOLTIP",14, decodeColor)
	
	function decodeColor(event) {
		if(!enabled) return;
		let array = new Uint8Array(new Uint32Array([event.dye]).buffer)
		m.command.message(`${MSG.linkUserItem(event.id,event.dbid)} R:${array[2]}, G:${array[1]}, B:${array[0]}, A:${array[3]*4}`);
	}
	
	this.destructor = () => {
		m.command.remove("color");
	};
};


class TeraMessage {
	constructor(mod) {
		this.mod = mod;
	}
	//HTML colors
	clr(text, hexColor) {
		return `<FONT color="${hexColor}">${text}</FONT>`;
	}
	RED(text) {
		return `<FONT color="#FF0000">${text}</FONT>`;
	}
	BLU(text) {
		return `<FONT color="#56B4E9">${text}</FONT>`;
	}
	YEL(text) {
		return `<FONT color="#E69F00">${text}</FONT>`;
	}
	TIP(text) {
		return `<FONT color="#00FFFF">${text}</FONT>`;
	}
	GRY(text) {
		return `<FONT color="#A0A0A0">${text}</FONT>`;
	}
	PIK(text) {
		return `<FONT color="#FF00DC">${text}</FONT>`;
	}
	
	//Tera chat channels
	chat(msg) {
		this.mod.command.message(msg);
	}
	party(msg) {
		this.mod.send("S_CHAT", this.mod.majorPatchVersion >= 108 ? 4 : 3, {
			"channel": 21,
			"message": msg
		});
	}
	partySmall(msg) {
		this.mod.send("S_CHAT", this.mod.majorPatchVersion >= 108 ? 4 : 3, {
			"channel": 1,
			"message": msg
		});
	}
	partyOutSmall(msg) {
		this.mod.send("C_CHAT", 1, {
			"channel": 1,
			"message": msg
		});
	}
	partyOut(msg) { //Send to party notice chat.
		this.mod.send("C_CHAT", 1, {
			"channel": 21,
			"message": msg
		});
	}
	guildOut(msg) { //Send to guild chat.
		this.mod.send("C_CHAT", 1, {
			"channel": 2,
			"message": msg
		});
	}
	sayOut(msg) { //Send to say chat.
		this.mod.send("C_CHAT", 1, {
			"channel": 0,
			"message": msg
		});
	}
	raids(msg) {
		this.mod.send("S_CHAT", this.mod.majorPatchVersion >= 108 ? 4 : 3, {
			"channel": 25,
			"message": msg
		});
	}
	alert(msg, type) {
		this.mod.send("S_DUNGEON_EVENT_MESSAGE", 2, {
			"type": type,
			"chat": false,
			"channel": 0,
			"message": msg
		});
	}
	
	//Additional functionality
	itemDesc(s) {
        const data = this.mod.game.data.items.get(s)
        return data ? data.name : "Undefined"
    }
	linkItem(item){
		return this.RED("<ChatLinkAction param=\"1#####"+parseInt(item)+"@-1\">["+this.itemDesc(parseInt(item))+"]</ChatLinkAction>")
	}
	linkUserItem(item,dbid){
		return this.RED("<ChatLinkAction param=\"1#####"+parseInt(item)+"@"+Number(dbid)+"\">["+this.itemDesc(parseInt(item))+"]</ChatLinkAction>")
	}
}
