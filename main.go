package main

import (
	"fmt"
	"html/template"
	"net/http"
	"github.com/nicksnyder/go-i18n/i18n"
	"log"
	"time"
	"io/ioutil"
	"encoding/json"
	"math"
	"strings"
	_ "github.com/go-sql-driver/mysql"
	"database/sql"
	"os"
	"math/rand"
//	"strconv"
)




type error interface {
    Error() string
}

type Configuration struct {
    DbUser    string
    DbPass   string
		DbName	string
		DbHost	string
		EtherscanApiKey0	string
		EtherscanApiKey1	string
		EtherscanApiKey2	string
}
var configuration Configuration


var gasPriceFast float64
var gasPriceAverage float64
var ethPriceUSD float64
var ethPriceRUR float64
func goGetGasPrice() {
	for {
		<-time.After(1800 * time.Second)
			getGasPrice()
	}
}

func goGetEthPrice() {
	for {
		<-time.After(600 * time.Second)
			getEthPrice()
	}
}
func getGasPrice() {
	//fmt.Println("Check gas price")
		res, err := http.Get("https://ethgasstation.info/json/ethgasAPI.json")

		if err != nil {
    	gasPriceFast = 9999
			fmt.Println(err)
			fmt.Println("Error while request to ethgasstation - 9999001")
		} else {
			body, err := ioutil.ReadAll(res.Body)
		if err != nil {
			gasPriceFast = 9999
			fmt.Println("Error while request to ethgasstation - 9999002")
		} else {
			var rd map[string]interface{}
			json.Unmarshal(body, &rd)
			if _, ok := rd["average"]; ok {
				gasPriceAverage = math.Ceil(rd["average"].(float64) / 10)
				gasPriceFast = rd["fast"].(float64) / 10
			} else {
				gasPriceFast = 9999
				fmt.Println("Error while request to ethgasstation - 9999003")
			}

		}

	}
}


func getEthPrice() {
	//fmt.Println("Check eth price")
	res, err := http.Get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,RUR")
	if err != nil {
		ethPriceUSD = 0
		fmt.Println("Error while request to cryptocompare - 9999004")
	} else {
		bodyeth, err2 := ioutil.ReadAll(res.Body)
	if err2 != nil {
		ethPriceUSD = 0
		fmt.Println("Error while request to cryptocompare - 9999005")
	} else {
	var rdeth map[string]interface{}
	json.Unmarshal(bodyeth, &rdeth)
	if _, okk := rdeth["USD"]; okk {
		ethPriceUSD = rdeth["USD"].(float64)
		ethPriceRUR = rdeth["RUR"].(float64)
	} else {
		ethPriceUSD = 0
		fmt.Println("Error while request to cryptocompare - 9999006")
			}
		}
	}
}

func counter(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "text/html")
	t, _ := template.ParseFiles("template/counter.html")
	t.Execute(w, nil)
}

func chart(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "text/html")
	t, _ := template.ParseFiles("template/chart.html")
	t.Execute(w, nil)
}



func errorHandler404(w http.ResponseWriter, r *http.Request, status int) {
	w.WriteHeader(status)
	if status == http.StatusNotFound {
		t, _ := template.ParseFiles("template/404.html")
		t.Execute(w, "error")
	}
}


func randKey() string {
	keyvar:=rand.Intn(3)
	switch keyvar {
	case 0:
		return configuration.EtherscanApiKey0
	case 1:
		return configuration.EtherscanApiKey1
	case 2:
		return configuration.EtherscanApiKey2
	}
	return "err"
}


func getTransactions(w http.ResponseWriter, r *http.Request) {

//keyvar:=fmt.Sprintf("%s%d", "EtherscanApiKey", rand.Intn(3))

//fmt.Println(strings.Join([]string{"EtherscanApiKey",strconv.Itoa(rand.Intn(3))},""))

	w.Header().Set("Access-Control-Allow-Origin", "*")
	address := r.URL.Query().Get("address")
	network := r.URL.Query().Get("network")
	var apiNetwork = ""
	if network != "mainnet" && network != "ropsten" && network != "rinkeby" && network != "kovan" {
		network = "mainnet"
	}


	if network != "mainnet" {
		apiNetwork = strings.Join([]string{"-", network}, "")
	} else {
		apiNetwork = ""
	}


 		res, err := http.Get(strings.Join([]string{"http://api", apiNetwork, ".etherscan.io/api?module=account&action=txlist&address=", address, "&page=1&offset=100&startblock=0&endblock=99999999&sort=desc&apikey=", randKey()}, ""))


	if err != nil {
		fmt.Fprintf(w, err.Error())
		return
	}
	body, _ := ioutil.ReadAll(res.Body)
	var ri map[string]interface{}
	json.Unmarshal(body, &ri)
	fmt.Fprintf(w, string(body))



}

func checkErr(err error) {
		if err != nil {
				panic(err)
		}
}



func main() {
	rand.Seed(time.Now().Unix())
	file, _ := os.Open("conf.json")
	defer file.Close()
	decoder := json.NewDecoder(file)
	//configuration := Configuration{}
	err := decoder.Decode(&configuration)
	if err != nil {
	  fmt.Println("Can't read conf.json:", err)
	}

	db, err := sql.Open("mysql", strings.Join([]string{configuration.DbUser, ":", configuration.DbPass, "@tcp(", configuration.DbHost, ":3306)/", configuration.DbName, "?charset=utf8"}, ""))
	checkErr(err)


	getGasPrice()
	getEthPrice()
	go goGetGasPrice()
	go goGetEthPrice()
	i18n.MustLoadTranslationFile("langs/en-US.all.json")
	i18n.MustLoadTranslationFile("langs/ru-RU.all.json")
	mainTemp, _ := template.New("main").Funcs(template.FuncMap{"T": func(string) string { return "" },}).ParseGlob("template/*.html")
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	cookieLang, cookieErr := r.Cookie("lang")
	cookievalue:=""
	if cookieErr == nil {
		cookievalue = cookieLang.Value
	} else {
		cookievalue =""
	}
	accept := r.Header.Get("Accept-Language")
	defaultLang := "en-US"
	t2, _ := mainTemp.Lookup("main").Clone()
	T, _ := i18n.Tfunc(cookievalue, accept, defaultLang)
	t2.Funcs(template.FuncMap{
		"T": T,
	}).Execute(w, map[string]interface{}{"Title": "ETH Admin",
																			 "gasPriceFast": gasPriceFast,
																		   "gasPriceAverage": gasPriceAverage,
																		 	 "ethPriceUSD": ethPriceUSD,
																		 	 "ethPriceRUR": ethPriceRUR})
	})

	http.HandleFunc("/counter.html", counter)
	http.HandleFunc("/chart.html", chart)
	http.HandleFunc("/stat/", func(w http.ResponseWriter, r *http.Request) {
		currentTime := time.Now()
		w.Header().Set("Access-Control-Allow-Origin", "*")
		address := r.URL.Query().Get("address")
		k := r.URL.Query().Get("key")
		v := r.URL.Query().Get("value")
		v2 := r.URL.Query().Get("value2")
		stmt, err := db.Prepare("INSERT wallet SET date=?,k=?,v=?, v2=? , address=?")
		checkErr(err)
		if k!="" {
			stmt.Exec(currentTime.Format("2006.01.02 15:04:05"),k, v, v2, address)
		}
		fmt.Fprintf(w, "<status>OK</status>")
	})

	fs := http.FileServer(http.Dir("assets"))
	http.Handle("/assets/", http.StripPrefix("/assets/", fs))
	http.HandleFunc("/getTransactions/", getTransactions)
	fmt.Println("ETH Admin is listening on http://localhost:9123")
	errS := http.ListenAndServe(":9123", nil) // задаем слушать порт



	if errS != nil {
		log.Fatal("Error: ", err)
	}
}
