// Module NPM
const async = require("async");

// Models
const PoleEmploi = require("./../models/PoleEmploi.js");

const TITLE = "Find your job";
const METHOD_POST = "POST";

class HomeController{

    constructor(){
        this.toto = "default";
        this.sites = [];
        
        // Bind public methods
        this.index = this.index.bind(this);
    }
    
    index(request, response){
        var research = request.body.research;
        var sitesResult = [];

        // Gestion de la multi-recheche
        if(research && research != ""){
            var listResearch = research.split("\n");
            var parallelResearch = [];
            
            listResearch.forEach((search) => {
                
                var search = search.trim();
                
                if(search && search != ""){
                    parallelResearch.push(
                        function(callback) {
                            if(request.method == METHOD_POST){
                                
                                PoleEmploi.query(search, (error, result) => {
                                    if(error){
                                        callback(`PoleEmploi return error : ${error}`, null);
                                    }else{
                                        callback(null, result);
                                    }
                                });
                            }else{
                                callback(null, []);
                            }
                        }
                    );
                }
            });
        }

        // Appel des différents sites
        async.parallel(parallelResearch, (error, results) => {
            
            // S'il n'y a pas d'erreur, on concatène les résultats
            if(error){
                console.error(error);
            }else if(results.length > 0){
                results.forEach( (result) => {
                    sitesResult = sitesResult.concat(result);
                });
            }
            
            // On affiche les résultats
            response.render('index', {
                "data" : {
                    "title" : TITLE,
                    "research" : research,
                    "sitesResult" : sitesResult
                }
            });
        });
    }
};

module.exports = new HomeController();