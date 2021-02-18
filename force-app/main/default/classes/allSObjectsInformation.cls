public inherited sharing class allSObjectsInformation {
    
    @AuraEnabled(cacheable=true)
    public static Map<String, String> getAllSObjectsLabels() {
        Map<String, String> objectsLabels = new Map<String, String>();
        for(Schema.SObjectType objType : Schema.getGlobalDescribe().Values()){
            String label = objType.getDescribe().getLabel();
            String name = objType.getDescribe().getName();
            objectsLabels.put(label, name);      
        }

        return objectsLabels;
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, String> getSObjectInfo(String sObjectName) {
        Map<String, String> objectInfo = new Map<String, String>();
        Schema.DescribeSObjectResult obj = Schema.getGlobalDescribe().get(sObjectName).getDescribe();
        objectInfo.put('label', obj.getLabel());
        objectInfo.put('apiName', obj.getName());
        objectInfo.put('keyPrefix', obj.getKeyPrefix());
        objectInfo.put('queryable', String.valueOf(obj.isQueryable()));
        objectInfo.put('searchable', String.valueOf(obj.isSearchable()));
        objectInfo.put('updateable', String.valueOf(obj.isUpdateable()));
        objectInfo.put('custom', String.valueOf(obj.isCustom()));
        return objectInfo;
    }

    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getFewFieldsInformationFromObject(String objectName){
        List<Map<String, String>> result = new List<Map<String, String>>();
        Schema.SObjectType relatedObject = Schema.getGlobalDescribe().get(objectName);
        Map<String, Schema.SObjectField> relatedFields = relatedObject.getDescribe().fields.getMap();
        Integer counter = 0;

        System.Debug(relatedFields);
        for(String field : relatedFields.keySet()){
            Map<String, String> loopMap = new Map<String, String>();
            loopMap.put('name', relatedFields.get(field).getDescribe().getName());
            loopMap.put('type', String.valueOf(relatedFields.get(field).getDescribe().getType()));
            loopMap.put('calculated', String.valueOf(relatedFields.get(field).getDescribe().isCalculated()));
            loopMap.put('sortable', String.valueOf(relatedFields.get(field).getDescribe().isSortable()));
            result.add(loopMap);
            
            if(counter++ >= 4){
                break;
            }
        }

        return result;
    }   
}