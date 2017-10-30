// Module NPM
const request = require("request");
const cheerio = require("cheerio");

// Libs
const StringAdds = require("./../libs/StringAdds.js");

// Models
const Job = require("./../models/Job.js").Job;
const Replacement = require("./../models/Replacement.js"); 

class Site {
    constructor(name, defaultUrlIn, defaultUrlOut){
        this.name = name;
        this.defaultUrlIn = defaultUrlIn;
        this.defaultUrlOut = defaultUrlOut;
        this.replacements = [];
    }
    
    // Analyse du dom du site pour obtenir les jobs
    analyseDom(research, body){return []};
    
    // Permet d'initialiser la liste des remplacements
    initReplacements(){
        this.replacements = [];
    }

    // Nettoyage des caractères spéciaux de la recherche
    cleanResearch(research){
        var result = research.trim();
        // Suppression des déterminants
        result = StringAdds.replaceAll(result, "d'", "");
        result = StringAdds.replaceAll(result, "l'", "");  

        // Suppression de caractères spéciaux
        result = StringAdds.replaceAll(result, "-", " ");
        result = StringAdds.replaceAll(result, "'", " ");

        return result;
    }
    
    // Format une URL en entrée avec les termes de remplacement
    formatUrl(url, replacements){
        var result = url;
        
        replacements.forEach((element) => {
            result = StringAdds.replaceAll(result, element.input, element.output);
        });

        return result;
    }
    
    // Recherche les résultats d'une recherche
    // Le callback analyse le dom qui lui est transmis
    query(research, callback){

        // Initialisation des termes à remplacer
        this.initReplacements();

        // On enlève les caractères spéciaux de la recherche
        research = this.cleanResearch(research);

        // Formatage de la recherche pour interroger le site
        var queryResearch = encodeURIComponent(research);
        this.replacements.push(new Replacement("{RECHERCHE}", queryResearch));
        var urlResearch = this.formatUrl(this.defaultUrlIn, this.replacements);

        // Interrogation du site
        request.get(urlResearch, (error, response, body) => { // TODO Plus de résultat avec clique sur le bouton ?

           if(error || response.statusCode != 200){
               callback(`Module request get : ${error}`, null);
           }else{
               var $ = cheerio.load(body);
               var domResult = this.analyseDom(research, $);
               callback(null, domResult);
           }
        });
    }
};

module.exports = Site;