var chatObj = {
  connection: null

  jid_to_id: function(jid) {
    return Strophe.getBareJidFromJid(jid)
        .replace(/@/g, "-")
        .replace(/\./g, "-");
  },

  
}
