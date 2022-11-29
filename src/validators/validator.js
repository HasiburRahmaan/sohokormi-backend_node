function validator(formData, ruleData, customRuleMessageObject) {
  let response = {};
  for (let field in ruleData) {
    let errorMsg = "";

    for (let rule in ruleData[field]) {
      if (response[field]) {
        break;
      }
      if (rule === "required") {
        if (
          typeof formData[field] == "undefined" ||
          formData[field] == null ||
          !formData[field].toString().trim().length > 0
        ) {
          errorMsg = generateMessage(
            customRuleMessageObject,
            field,
            rule,
            `field is required`
          );
        }
      } else if (rule === "type") {
        switch (ruleData[field][rule]) {
          case "phone":
            if (
              formData[field]?.length !== 11 ||
              !formData[field].startsWith("01") ||
              isNaN(Number(formData[field]))
            ) {
              errorMsg = generateMessage(
                customRuleMessageObject,
                field,
                rule,
                `invalid phone`
              );
            }
            break;

          default:
            break;
        }
      } else {
        switch (rule) {
          case "maxLen":
            if (formData[field].toString().length > ruleData[field][rule]) {
              errorMsg =
                customRuleMessageObject &&
                customRuleMessageObject[field] &&
                customRuleMessageObject[field][rule]
                  ? customRuleMessageObject[field][rule]
                  : `maximum length is ${ruleData[field][rule]} `;
            }
            break;

          case "minLen":
            if (formData[field].toString().length < ruleData[field][rule]) {
              errorMsg = generateMessage(
                customRuleMessageObject,
                field,
                rule,
                `minimum length is ${ruleData[field][rule]} `
              );
            }

            break;

          case "max":
            if (formData[field] > ruleData[field][rule]) {
              errorMsg = generateMessage(
                customRuleMessageObject,
                field,
                rule,
                `maximum  is ${ruleData[field][rule]}`
              );
            }
            break;

          case "min":
            if (formData[field] < ruleData[field][rule]) {
              errorMsg = generateMessage(
                customRuleMessageObject,
                field,
                rule,
                `minimum  is ${ruleData[field][rule]} `
              );
            }
            break;

          default:
            break;
        }
      }

      if (errorMsg.length) {
        response[field] = errorMsg;
      }
    }
  }

  return response;
}

function generateMessage(customRuleMessageObject, field, rule, defaultMessage) {
  return customRuleMessageObject &&
    customRuleMessageObject[field] &&
    customRuleMessageObject[field][rule]
    ? customRuleMessageObject[field][rule]
    : defaultMessage;
}

module.exports = { validator };

/* Example */
// console.log(validator({ name: "", role: "" }, { name: { maxLen: 4 } }));

/*
      //current validation rules
  
      * required: boolean
      * maxLen: number // will check string maximum length limit
      * minLen: number // will check string minimum length limit 
      * max: number // will check maximum limit 
      * min: number // will check minimum limit
  
  */

/* 
   //Exampel
  
   obj = {id:5, name:"John Doe", Roll: 1}
  
   objRules = {
      id: {
        required: true,
        exists:"students:id:5" // tablename:columnName:exceptValue
      },
      name:{
          required: true,
          type: "string"
          maxLen: 5,
          minLen: 1,
      },
      roll:{
          required: true,
          type: "number",
          max: 100,
          min: 1
      }
  
    customMessage = {
      name:{
          required: "Name is not Present",
          maxLen: 'Can not be more than 5',
      },
      
    }
  
  
    return value {
      name: "name is required",
      roll: "roll is required"
    }
    
  
   }
  
  
  
  
  */
