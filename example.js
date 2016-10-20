pseudoloc.json(
    fs.readFileSync('./example.json'),
    {
        method: "pseudo",
        asian: true // use asian characters that vaguely look like latin characters
    })
    .then(function(data) {
        fs.writeFileSync('./example.pseudo.json', data)
    });

pseudoloc.po(
    fs.readFileSync('./locale/templates/LC_MESSAGES/messages.pot'),
    {
        method: "google",
        apiKey: "GOOGLE_CLOUD_COMPUTE_KEY",
        targetLanguage: "es"
    })
    .then(function (data) {
        fs.writeFileSync('./locale/es/LC_MESSAGES/messages.po')
    });
