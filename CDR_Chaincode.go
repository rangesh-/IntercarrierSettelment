package main

import (

        "encoding/json"
        "fmt"        
        "time"

        "github.com/hyperledger/fabric/core/chaincode/shim"
        pb "github.com/hyperledger/fabric/protos/peer"
        oraclizeapi "github.com/provable-things/fabric-api"
)

type CDR struct {
        DOCType           string `json:"docType"` //docType is used to distinguish the various types of objects in state datab
        ID                string `json:"id"`    //the fieldtags are needed to keep case from bouncing around
        CALLING_NUM       string `json:"callnum"`
        CALLED_NUMBER     string `json:"callednum"`
        START_TIME        string `json:"starttime"`
        END_TIME          string `json:"endtime"`
        CALL_TYPE         string `json:"calltype"`
        CHARGE            float64 `json:"charge"`
        CALL_RESULT       string `json:"callresult"`
        Mins              int `json:"mins"`
        Operator           string `json:"opname"`
        ProvableValue     string `json:"proof"`
        LoadDate string `json:"loadDate"`
    
}

type CDRReport struct{
        DocType       string `json:"docType"`
        TotalMinutes  int `json:"totalminutes"`
        TotalCharge   float64 `json:"totalcharge"`
        TotalDispute  int `json:"totalDispute"`
        TotalCDR      int `json:"totalCDR"`
        TotalVoiceCount int `json:"totalvoice"`
        TotalSMSCount int `json:"totalsms"`
        Month int `json:"month"`
        LoadDate string `json:"loadDate"`
}


//https://api.jsonbin.io/b/5e5135a4d3c2f35597f5bfee

// SmartContract defines the Smart Contract structure
type SmartContract struct {
}

func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) pb.Response {
        return shim.Success(nil)
}

func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) pb.Response {
        // Retrieve the requested Smart Contract function and arguments
        function, args := APIstub.GetFunctionAndParameters()
        // Route to the appropriate handler function to interact with the ledger appropriately
        if function == "fetchEURUSDviaOraclize" {
                return s.fetchEURUSDviaOraclize(APIstub)
        }
        if function == "invokeCDRDispute"{
                return s.invokeCDRDispute(APIstub,args)
        }
        fmt.Println("function:", function, args[0])
        return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) fetchEURUSDviaOraclize(APIstub shim.ChaincodeStubInterface) pb.Response {
        fmt.Println("============= START : Calling the oraclize chaincode =============")
        var datasource = "URL"                                                                  // Setting the Oraclize dataso
        var query = "json(https://min-api.cryptocompare.com/data/price?fsym=EUR&tsyms=USD).USD" // Setting the query
        result, proof := oraclizeapi.OraclizeQuery_sync(APIstub, datasource, query, oraclizeapi.TLSNOTARY)
        fmt.Printf("proof: %s", proof)
        fmt.Printf("\nresult: %s\n", result)
        fmt.Println("Do something with the result...")
        fmt.Println("============= END : Calling the oraclize chaincode =============")
        return shim.Success(result)
}

func (s *SmartContract) invokeCDRDispute(APIstub shim.ChaincodeStubInterface,args []string) pb.Response {
        var objcdrreport CDRReport
        var objcdrreports []CDRReport
        currentTime := time.Now()
        reportkey:=currentTime.Format("01-02-2006")
	m := currentTime.Month()
        month:= int(m)
        //Get Current Report of today load 
        CDRReportBytes, _:= APIstub.GetState(reportkey)
        json.Unmarshal([]byte(CDRReportBytes), &objcdrreports)
        if len(objcdrreports)>0{
                objcdrreport=objcdrreports[0] 
        }
        var objcr []CDR
        var datasource = "URL"                                                                  // Setting the Oraclize dataso
        var query = "json("+args[0] +").CDR" // Setting the query
        fmt.Printf("\nobjcr: %s\n", query)
        result, proof := oraclizeapi.OraclizeQuery_sync(APIstub, datasource, query, oraclizeapi.TLSNOTARY)
        json.Unmarshal([]byte(result), &objcr)
        for  i:=0;i<len(objcr)-1;i++ {
         if(objcr[i].CALLING_NUM=="" || objcr[i].CALLED_NUMBER=="" || objcr[i].START_TIME=="" || objcr[i].END_TIME==""||objcr[i].CALL_TYPE==""){
                objcr[i].DOCType="CDR_Dispute" 
                objcr[i].LoadDate=reportkey
                objcr[i].ProvableValue=string(proof[:])
                objCDRasBytes, err := json.Marshal(objcr[i])
                err = APIstub.PutState(objcr[i].ID, objCDRasBytes)
                objcdrreport.TotalDispute+=1
                if err != nil {
                        return shim.Error(err.Error())
                }
         }
         objcdrreport.Month=month
         objcdrreport.LoadDate=reportkey
         objcdrreport.TotalMinutes+=objcr[i].Mins
         objcdrreport.TotalCharge+=objcr[i].CHARGE
         objcdrreport.TotalCDR=len(objcr)
         if(objcr[i].CALL_TYPE=="SMS"){
                objcdrreport.TotalVoiceCount+= 1
         }
         if(objcr[i].CALL_TYPE=="VOICE"){
                objcdrreport.TotalSMSCount+= 1
         }
         objcdrreport.DocType="REPORT"        
        }
        objcdrreportasBytes,_ := json.Marshal(objcdrreport)
        APIstub.PutState(reportkey, objcdrreportasBytes)
        fmt.Printf("proof: %s", proof)
        fmt.Printf("\nresult: %s\n", result)
        fmt.Printf("\nobjcr: %s\n", objcr)

        fmt.Println("Do something with the result...")
        fmt.Println("============= END : Calling the oraclize chaincode =============")
        return shim.Success(nil)
}

func (s *SmartContract) queryCDRDispute(stub shim.ChaincodeStubInterface,args []string) pb.Response {
        return shim.Success(nil)
}
// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {
        // Create a new Smart Contract
        err := shim.Start(new(SmartContract))
        if err != nil {
                fmt.Printf("Error creating new Smart Contract: %s", err)
        }
}