import test from 'node:test';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
const url = process.env.VERIFY_URL || 'http://localhost:3001';
const executablePath = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','C:/Program Files/Google/Chrome/Application/chrome.exe'].find(existsSync);
await test('registration form layout and simulated checkout', async () => {
  const browser = await puppeteer.launch({executablePath,headless:true,pipe:true,args:['--no-sandbox','--disable-gpu']});
  try {
    const page = await browser.newPage();
    for (const width of [390,1440]) {
      await page.setViewport({width,height:1000});
      await page.goto(url,{waitUntil:'networkidle2'});
      await page.$eval('#registration',e=>e.scrollIntoView({behavior:"instant"}));
      const layout = await page.$eval('#registration',e=>({heading:e.querySelector('#registration-heading').textContent,fields:e.querySelectorAll('input').length,overflow:document.documentElement.scrollWidth>innerWidth}));
      assert.match(layout.heading,/2,499/); assert.equal(layout.fields,4); assert.equal(layout.overflow,false);
      console.log(width,layout);
      if (width < 640) await page.waitForFunction(() => document.querySelector('div[class*="fixed inset-x-0 bottom-0"]').inert);
      await (await page.$("#registration")).screenshot({path:`artifacts/registration-${width}.png`});
    }
    await page.close();
    const sim = await browser.newPage();
    await sim.evaluateOnNewDocument(()=>{ window.Razorpay=class {constructor(options){window.testCheckout=options;}on(){}open(){}}; });
    let orderCalls=0, verificationFails=false;
    await sim.setRequestInterception(true);
    sim.on('request',r=>{
      const path=new URL(r.url()).pathname;
      if(path==='/api/payments/order') {
        if(r.method()==='POST')orderCalls++;
        return r.respond({status:200,contentType:'application/json',body:JSON.stringify(r.method()==='GET'?{ready:true,amount:249900,currency:'INR'}:{orderId:'order_Test',amount:249900,currency:'INR',keyId:'rzp_test_example'})});
      }
      if(path==='/api/payments/verify')return r.respond({status:verificationFails?401:200,contentType:'application/json',body:JSON.stringify(verificationFails?{error:'Verification failed'}:{status:'paid',paymentId:'pay_Test'})});
      r.continue();
    });
    async function fill() {
      await sim.goto(url,{waitUntil:'networkidle2'});await sim.addStyleTag({content:"html { scroll-behavior: auto !important; }"});await sim.$eval('#registration',e=>e.scrollIntoView({behavior:"instant"}));
      for(const [name,value] of Object.entries({name:'Test Attendee',email:'test@example.com',phone:'9876543210',city:'Chennai'}))await sim.type(`#registration input[name="${name}"]`,value);
      assert.equal(await sim.$eval('#registration form',f=>f.checkValidity()),true);
    }
    async function clickPay() {
      await sim.waitForFunction(()=>!document.querySelector('#registration button').disabled);
      await sim.$eval('#registration button',e=>e.scrollIntoView({behavior:'instant',block:'center'}));
      await sim.click('#registration button');
    }
    await fill();
    await clickPay();await sim.waitForFunction(()=>!!window.testCheckout);
    assert.equal(await sim.evaluate(()=>window.testCheckout.amount),249900);
    assert.equal(await sim.evaluate(()=>window.testCheckout.prefill.email),'test@example.com');assert.equal(orderCalls,1);
    await sim.evaluate(()=>window.testCheckout.modal.ondismiss());await sim.waitForFunction(()=>!document.querySelector('#registration button').disabled);
    assert.match(await sim.$eval('#registration [aria-live]',e=>e.textContent),/closed/);
    await clickPay();await sim.waitForFunction(()=>document.querySelector('#registration button').textContent.includes('Processing'));
    await sim.evaluate(()=>window.testCheckout.handler({razorpay_order_id:'order_Test',razorpay_payment_id:'pay_Test',razorpay_signature:'mock'}));
    await sim.waitForFunction(()=>document.querySelector('#registration button').textContent==='Payment verified');
    assert.match(await sim.$eval('#registration [aria-live]',e=>e.textContent),/pay_Test/);
    verificationFails=true;await fill();await clickPay();await sim.waitForFunction(()=>!!window.testCheckout);
    await sim.evaluate(()=>window.testCheckout.handler({razorpay_order_id:'order_Test',razorpay_payment_id:'pay_Test',razorpay_signature:'mock'}));
    await sim.waitForFunction(()=>document.querySelector('#registration [aria-live]').textContent.includes('could not check'));
    assert.notEqual(await sim.$eval('#registration button',b=>b.textContent),'Payment verified');
    assert.equal(await sim.$eval('#registration button',b=>b.disabled),true);
    const ordersBeforeRecheck=orderCalls;verificationFails=false;
    await sim.click('#registration button[type="button"]');
    await sim.waitForFunction(()=>document.querySelector('#registration button').textContent==='Payment verified');
    assert.equal(orderCalls,ordersBeforeRecheck);
    console.log('Simulated checkout: prefill, fixed fee, cancellation, retry, verified success, and failed verification passed. No real payment made.');
    await sim.close();
  } finally {await browser.close();}
});
