const axios = require('axios')
const country = require('country-list');
const chalk = require('chalk')

const main = async ()=>{
  try{
    const getChinaIp = async () => {
      let url = 'https://www.taobao.com/help/getip.php'
      let response = await axios.get(url)
      let ip = response.data
      ip = ip.replaceAll(`ipCallback({ip:"`, '')
      ip = ip.replaceAll(`"})`, '')
      return ip
    }
  
    const getNonChinaIp = async () => {
      let urls = [
        'https://ifconfig.me/ip',
        'https://ip-fast.com/api/ip/'
      ]
      let index = Math.floor(Math.random() * 2)
      let url = urls[index]
      let response = await axios.get(url)
      let ip = response.data
      return ip
    }
  
    const getGeoInfo = async (ip) =>{
      let url = `https://ipinfo.io/${ip}/geo`
      let response = await axios.get(url)
      let geoinfo = response.data
      let result = {
        'city': geoinfo.city,
        'region': geoinfo.region,
        'country': country.getName(geoinfo.country),
        'timezone': geoinfo.timezone,
        'organization': geoinfo.org
      }
      return result
    }
  
    const getInfo = async (isInChina) => {
      let ip = ''
      if(isInChina){
        ip = await getChinaIp()
      }else{
        ip = await getNonChinaIp()
      }
      let geo = await getGeoInfo(ip)
      geo.ip = ip
      return geo
    }
  
    const tasks = [ getInfo(true), getInfo(false) ]
    const infos = await Promise.all(tasks)
    
    const results = []
    if(infos[0].ip === infos[1].ip){
      results.push(infos[0])
    }else{
      for(let info of infos){
        results.push(info)
      }
    }
  
    // Display
    const display = (results)=>{
      for(let result of results){
        console.log()
        if(result.country === 'China'){
          console.log(chalk.green.bold('CHINA NODE'))
        }else{
          console.log(chalk.green.bold('NON-CHINA NODE'))
        }
        for(let item of Object.entries(result)){
          console.log(chalk.green.bold(`${item[0].toUpperCase()}: `) + chalk.bold(item[1]))
        }
        console.log()
      }
    }
    display(results)

  }catch(error){
    console.error(chalk.red.bold(error.message))
  }
}

main()