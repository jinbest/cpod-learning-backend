/**
	Generated by sails-inverse-model
	Date:Fri May 17 2019 18:41:35 GMT+0800 (Hong Kong Standard Time)
*/

module.exports = {
    attributes: {
        id: {
            type: "number",
            columnType: "int",
            isInteger: true,
            required: true
        },
        source: {
            type: "number",
            columnType: "tinyint",
            isInteger: true,
            defaultsTo: 1
        },
        subscription_id: {
            type: "string",
            columnType: "varchar",
            maxLength: 255
        },
        transaction_id: {
            type: "string",
            columnType: "varchar",
            maxLength: 255
        },
        response_code: {
            type: "string",
            columnType: "varchar",
            maxLength: 2
        },
        response_reason_text: {
            type: "string",
            columnType: "text"
        },
        subscription_paynum: {
            type: "number",
            columnType: "int",
            isInteger: true
        },
        invoice_num: {
            type: "string",
            columnType: "varchar",
            maxLength: 255
        },
        amount: {
            type: "number",
            columnType: "decimal"
        },
        email: {
            type: "string",
            columnType: "varchar",
            maxLength: 255
        },
        cc_num: {
            type: "string",
            columnType: "varchar",
            maxLength: 255
        },
        status: {
            type: "number",
            columnType: "tinyint",
            isInteger: true,
            defaultsTo: 0
        },
        raw_data: {
            type: "string",
            columnType: "text"
        },
        created_at: {
            type: "string",
            columnType: "datetime"
        }
    }
};
