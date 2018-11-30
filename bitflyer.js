
formatTime = unixtime => {
  let date = new Date(unixtime)
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

const getBitflyerData = () => {

    $.ajax({
      method: 'GET',
      url: 'http://localhost:3000/bitflyer/btc/ticker'
    })
      .done(ticker => {
        $('#last').text(new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'JPY' }).format(ticker.last))
        $('#buy').text(new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'JPY' }).format(ticker.buy))
        $('#sell').text(new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'JPY' }).format(ticker.sell))
        $('#vol_btc').text(new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'BTC' }).format(ticker.vol_btc))
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(errorThrown)
      })
    
    $.ajax({
      method: 'GET',
      url: 'http://localhost:3000/bitflyer/btc/trades'
    })
      .done(trades => {
        $('#tradesTable').empty()
        trades.slice(0, 10).forEach(trade => {
          $('#tradesTable').append(`<tr>
      <td>${trade.amount}</td>
      <td>${new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(trade.price)}</td>
      <td>${formatTime(trade.date)}</td>
    </tr>`)
        });
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(errorThrown)
      })
    
    $.ajax({
      method: 'GET',
      url: 'http://localhost:3000/bitflyer/btc/depth'
    })
      .done(({ buy, sell }) => {
        $('#sellTable').empty()
        sell.slice(0, 10).forEach(row => {
          $('#sellTable').append(`<tr>
      <td>${new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(row.price)}</td>
      <td>${row.size}</td>
    </tr>`)
        })
    
        $('#buyTable').empty()
        buy.slice(0, 10).forEach(row => {
          $('#buyTable').append(`<tr>
      <td>${new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(row.price)}</td>
      <td>${row.size}</td>
    </tr>`)
        })
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(errorThrown)
      })
}

$(document).ready(() => {
  if (!localStorage.token) {
    windows.location.replace("http://localhost:8080")
  }
})
$(document).ready(getBitflyerData())
$(document).ready(setInterval(getBitflyerData, 5000))