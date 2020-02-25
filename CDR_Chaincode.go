package main

import (

        "encoding/json"
        "fmt"


        "github.com/hyperledger/fabric/core/chaincode/shim"
        pb "github.com/hyperledger/fabric/protos/peer"
        oraclizeapi "github.com/provable-things/fabric-api"
)

type CDR struct {
        ObjectType        string `json:"docType"` //docType is used to distinguish the various types of objects in state datab
        ID                string `json:"id"`    //the fieldtags are needed to keep case from bouncing around
        CALLING_NUM       string `json:"callnum"`
        CALLED_NUMBER     string `json:"callednum"`
        START_TIME        string `json:"starttime"`
        END_TIME         string `json:"endtime"`
        CALL_TYPE       string `json:"calltype"`
        CHARGE           string `json:"charge"`
        CALL_RESULT       string `json:"callresult"`
}

type CDRDispute struct {
        ObjectType        string `json:"docType"` //docType is used to distinguish the various types of objects in state datab
        ID                string `json:"id"`    //the fieldtags are needed to keep case from bouncing around
        CALLING_NUM       string `json:"callnum"`
        CALLED_NUMBER     string `json:"callednum"`
        START_TIME        string `json:"starttime"`
        END_TIME          string `json:"endtime"`
        CALL_TYPE        string `json:"calltype"`
        CHARGE           string `json:"charge"`
        CALL_RESULT       string `json:"callresult"`
        Dispute_Date      string `json:"disputedate"`
        DisputeReason     string `json:"disputeRason"`
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
        var objcr []CDR
        var datasource = "URL"                                                                  // Setting the Oraclize dataso
        var query = "json("+args[0] +").CDR" // Setting the query
        fmt.Printf("\nobjcr: %s\n", query)
        result, proof := oraclizeapi.OraclizeQuery_sync(APIstub, datasource, query, oraclizeapi.TLSNOTARY)
        json.Unmarshal([]byte(result), &objcr)
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