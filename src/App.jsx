import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

function getInitialCount() {
  const saved = localStorage.getItem("contador");
  return saved !== null ? parseInt(saved) : 0;
}

function getNextResetDate() {
  let dataReset = localStorage.getItem("dataReset");
  if (!dataReset) {
    const hoje = new Date();
    let proximoMes = hoje.getMonth() + 1;
    let ano = hoje.getFullYear();
    if (proximoMes > 11) {
      proximoMes = 0;
      ano++;
    }
    let dia = hoje.getDate();
    let ultimoDiaProxMes = new Date(ano, proximoMes + 1, 0).getDate();
    if (dia > ultimoDiaProxMes) dia = ultimoDiaProxMes;
    const dataResetObj = new Date(ano, proximoMes, dia);
    dataReset = dataResetObj.toISOString().split('T')[0];
    localStorage.setItem("dataReset", dataReset);
  }
  return dataReset;
}

export default function App() {
  const [contador, setContador] = useState(getInitialCount());
  const [dataReset, setDataReset] = useState(getNextResetDate());

  useEffect(() => {
    const hojeStr = new Date().toISOString().split('T')[0];
    if (hojeStr >= dataReset) {
      setContador(0);
      localStorage.setItem("contador", 0);
      // Define próxima data de reset
      const hoje = new Date();
      let proximoMes = hoje.getMonth() + 1;
      let ano = hoje.getFullYear();
      if (proximoMes > 11) {
        proximoMes = 0;
        ano++;
      }
      let dia = hoje.getDate();
      let ultimoDiaProxMes = new Date(ano, proximoMes + 1, 0).getDate();
      if (dia > ultimoDiaProxMes) dia = ultimoDiaProxMes;
      const novaDataReset = new Date(ano, proximoMes, dia).toISOString().split('T')[0];
      localStorage.setItem("dataReset", novaDataReset);
      setDataReset(novaDataReset);
    }
  }, [dataReset]);

  useEffect(() => {
    localStorage.setItem("contador", contador);
  }, [contador]);

  function somar() {
    setContador(c => c + 1);
  }
  function subtrair() {
    setContador(c => Math.max(0, c - 1));
  }
  function resetar() {
    setContador(0);
    // Atualiza data de reset para o próximo mês
    const hoje = new Date();
    let proximoMes = hoje.getMonth() + 1;
    let ano = hoje.getFullYear();
    if (proximoMes > 11) {
      proximoMes = 0;
      ano++;
    }
    let dia = hoje.getDate();
    let ultimoDiaProxMes = new Date(ano, proximoMes + 1, 0).getDate();
    if (dia > ultimoDiaProxMes) dia = ultimoDiaProxMes;
    const novaDataReset = new Date(ano, proximoMes, dia).toISOString().split('T')[0];
    localStorage.setItem("dataReset", novaDataReset);
    setDataReset(novaDataReset);
  }

  return (
    <div style={{textAlign: 'center', fontFamily: 'Arial, Helvetica, sans-serif', background: '#F1F5F8', minHeight: '100vh', paddingTop: 50}}>
      <h1>Contador de Punheta</h1>
      <p style={{fontSize: 100, margin: 0, color: 'cadetblue', fontFamily: 'Courier New, Courier, monospace'}}>{contador}</p>
      <div>
        <button style={{borderRadius: 35, border: '1px solid black', padding: 10, background: 'white'}} onClick={somar}>Aumentar</button>
        <button style={{borderRadius: 35, border: '1px solid black', padding: 10, background: 'white', marginLeft: 10}} onClick={subtrair} disabled={contador <= 0}>Diminuir</button>
        <button style={{borderRadius: 35, border: '1px solid black', padding: 10, background: 'white', marginLeft: 10}} onClick={resetar}>Resetar</button>
      </div>
      <p style={{marginTop: 30}}>Próximo reset: {dataReset}</p>
      <Analytics />
    </div>
  );
}
