// Libs
const StringAdds = require("./../libs/StringAdds.js");

// Models
const Site = require("./../models/Site.js");
const Job = require("./../models/Job.js").Job;
const Replacement = require("./../models/Replacement.js"); 

const URL_IN = "https://candidat.pole-emploi.fr/offres/recherche?lieux={DEPARTEMENT_CODE}D&motsCles={RECHERCHE}&offresPartenaires=true&rayon=10&tri=0";
const URL_OUT = "https://candidat.pole-emploi.fr/";

class PoleEmploi extends Site{
    
    constructor(){
        super("pole-emploi", URL_IN, URL_OUT);
        this.replacements.push(new Replacement("{DEPARTEMENT_CODE}", "13"));

        // Partage de closure (this)
        this.query = this.query.bind(this);
    }
    
    // Analyse du dom du site pour obtenir les jobs
    analyseDom(research, $){

        var result = [];
        var contentJob = $(".media-body");
       
        contentJob.each((i, element) => {
        
            var h2_media = element.children[0];
            var a_media = h2_media.children[0];
            var title = StringAdds.replaceAll(a_media.children[0].data, "\n", "");
            title = StringAdds.replaceAll(title, "-", " ");
            title = StringAdds.replaceAll(title, "'", " ");
            
            var p_subtext = element.children[1];
            var companyName = p_subtext.children[0].data;
            companyName = StringAdds.replaceAll("\n", "");
            companyName = !companyName || companyName == "" ? "" : companyName.substring(0, companyName.length - 3);
            var localisation = p_subtext.children[1].children[0].data;
            localisation = StringAdds.replaceAll(localisation, "\n", "");

            var p_description = element.children[2];
            var description = p_description.children[0].data;
            
            var dateCreation = "";
            var p_dayOlder = element.children[3];
            var dayOlder = p_dayOlder.children[0].data;
            
            var p_contract = element.next.children[0];
            var contractType = p_contract.children[0].data;
            var contractTime = p_contract.children[2] ? p_contract.children[2].data : "";
            
            var periodeDelay = "";
            var url = this.defaultUrlOut + a_media.attribs.href;
            var companyName = "";
            
            var job = new Job(title, description, contractType, contractTime, dateCreation, dayOlder, periodeDelay, url, companyName, localisation);

            // Recherche stricte sur les termes
            if(StringAdds.splitIncludes(job.title, research, " ")){
                result.push(job);
            }
      });

      return result;
   }
   
   initReplacements(){
        super.initReplacements();
        this.replacements.push(new Replacement("{DEPARTEMENT_CODE}", "13"));
    }
}

module.exports = new PoleEmploi();