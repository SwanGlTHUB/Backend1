import { LightningElement, wire, track } from 'lwc';
import getAllSObjectsLabels from '@salesforce/apex/allSObjectsInformation.getAllSObjectsLabels'
import getSObjectInfo from '@salesforce/apex/allSObjectsInformation.getSObjectInfo'
import getFewFieldsInformationFromObject from '@salesforce/apex/allSObjectsInformation.getFewFieldsInformationFromObject' 

const columns = [
    { label: 'Name', fieldName: 'name' },
    { label: 'Type', fieldName: 'type'},
    { label: 'Calculated', fieldName: 'calculated'},
    { label: 'Sortable', fieldName: 'sortable'},
]

export default class SchemaVisualisation extends LightningElement {
    @track allSObjects
    @track comboboxOptions
    @track selectedObjectApiName = 'Account'
    @track selectedObjectInfo
    @track showObjectInfo = false
    @track generalInformation = {}
    @track columns = columns
    @track data


    @wire(getAllSObjectsLabels) getLabels(response){
        if(response.error){
            console.log(error)
            return
        }
        if(response.data){
            this.allSObjects = response.data
            this.prepareLabelsForDisplay()
        }
    }

    prepareDatatableData(fields){
        let data = []
        Object.keys(fields).forEach((field) => {
            data.push(fields[field])
        })
        this.data = data
    }

    prepareGeneralInformationToDisplay(obj){
        this.generalInformation.label = obj.label
        this.generalInformation.apiName = obj.apiName
        this.generalInformation.possibleIconName = 'standard:' + obj.apiName.toLowerCase();
        this.generalInformation.keyPrefix = obj.keyPrefix
        this.generalInformation.updateable = obj.updateable
        this.generalInformation.queryable = obj.queryable
        this.generalInformation.searchable = obj.searchable
        this.generalInformation.custom = obj.custom
    }

    prepareLabelsForDisplay(){
        let comboboxOptions = []
        Object.keys(this.allSObjects).forEach((label) => {
            comboboxOptions.push({label: label, value: this.allSObjects[label]})
        })
        this.comboboxOptions = comboboxOptions
    }

    handleCombobox(event){
        this.selectedObjectApiName = event.target.value
        let allPromises = []
        allPromises.push(
            getSObjectInfo({sObjectName : event.target.value})
            .then((response) => {
                this.prepareGeneralInformationToDisplay(response)
                this.showObjectInfo = true
            })
            .catch((error) => {
                console.log(error)
            }),
            getFewFieldsInformationFromObject({objectName : event.target.value})
            .then((response) => {
                this.prepareDatatableData(response)
            })
            .catch((error) => {
                console.log(error)
            })
        )

        Promise.all(allPromises)
        .then(() => {
            this.showObjectInfo = true
        })
        
    }
}