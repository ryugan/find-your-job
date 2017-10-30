var Enum = require("enumify").Enum

class ContractType extends Enum {}
ContractType.initEnum(['Unknow', 'CDD', 'CDI', 'Intérim']);

class ContractTime extends Enum {}
ContractTime.initEnum(['Unknow', 'Temps partiel', 'Temps plein']);

class Job {
  constructor(title, description, contractType, contractTime, dateCreation, dayOlder, delay, url, companyName, localisation){
      this.title = title;
      this.description = description;
      this.contractType = contractType; // See class ContractType
      this.contractTime = contractTime; // See class ContractTime
      this.dateCreation = dateCreation;
      this.dayOlder = dayOlder;
      this.periodeDelay = delay;
      this.url = url;
      this.companyName = companyName;
      this.localisation = localisation;
  }  
};

module.exports.ContractType = ContractType;
module.exports.ContractTime = ContractTime;
module.exports.Job = Job;