import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'audit-screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const PAGES_TO_TEST = [
  { path: '/', name: 'home' },
  { path: '/servicos', name: 'servicos' },
  { path: '/monte-seu-evento', name: 'monte-seu-evento' },
  { path: '/galeria', name: 'galeria' },
  { path: '/sobre', name: 'sobre' },
  { path: '/duvidas', name: 'duvidas' },
  { path: '/contato', name: 'contato' },
  { path: '/admin', name: 'admin' },
];

async function runVisualAudit() {
  console.log('🚀 Starting Visual Audit with Playwright...');
  const browser = await chromium.launch({ headless: true });

  const auditReport = {
    timestamp: new Date().toISOString(),
    pagesChecked: [],
    overflowIssues: [],
    consoleErrors: [],
    interactiveTests: {},
  };

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n📱 Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        userAgent:
          vp.name === 'mobile'
            ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
            : undefined,
      });

      const page = await context.newPage();

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          console.error(`  ❌ Console Error [${vp.name}]:`, msg.text());
          auditReport.consoleErrors.push({
            viewport: vp.name,
            error: msg.text(),
          });
        }
      });

      for (const p of PAGES_TO_TEST) {
        const url = `http://localhost:3000${p.path}`;
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
        } catch (e) {
          // If networkidle times out due to streaming, wait for load
          await page.goto(url, { waitUntil: 'load', timeout: 15000 });
        }

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const bodyWidth = document.body.scrollWidth;
          const docWidth = document.documentElement.scrollWidth;
          const windowWidth = window.innerWidth;
          const hasOverflow = bodyWidth > windowWidth || docWidth > windowWidth;
          return {
            hasOverflow,
            bodyWidth,
            docWidth,
            windowWidth,
            diff: Math.max(bodyWidth, docWidth) - windowWidth,
          };
        });

        if (overflow.hasOverflow) {
          console.warn(`  ⚠️ HORIZONTAL OVERFLOW DETECTED: ${p.path} on ${vp.name} (+${overflow.diff}px)`);
          auditReport.overflowIssues.push({
            viewport: vp.name,
            page: p.path,
            overflow,
          });
        } else {
          console.log(`  ✓ ${p.path} [${vp.name}]: No overflow (doc: ${overflow.docWidth}px / win: ${overflow.windowWidth}px)`);
        }

        // Take screenshot
        const screenshotPath = path.join(
          SCREENSHOT_DIR,
          `${p.name}-${vp.name}.png`
        );
        await page.screenshot({ path: screenshotPath, fullPage: true });

        auditReport.pagesChecked.push({
          page: p.path,
          viewport: vp.name,
          screenshot: screenshotPath,
          hasOverflow: overflow.hasOverflow,
        });
      }

      await context.close();
    }

    // Interactive flow test on Desktop and Mobile
    console.log('\n🧪 Testing Interactive Stepper ("Monte seu Evento")...');
    const flowContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const flowPage = await flowContext.newPage();
    await flowPage.goto('http://localhost:3000/monte-seu-evento', { waitUntil: 'load' });

    // Step 1: Select "Festival de Massas"
    console.log('  -> Selecting service...');
    await flowPage.click('text=Festival de Massas Artesanais');
    await flowPage.click('text=Avançar');

    // Step 2: Select Guests 31-50
    console.log('  -> Selecting guest count...');
    await flowPage.click('text=31 – 50');
    await flowPage.click('text=Avançar');

    // Step 3: Date & time
    console.log('  -> Filling date & time...');
    await flowPage.fill('#eventDate', '2026-12-15');
    await flowPage.click('text=Avançar');

    // Step 4: Event type
    console.log('  -> Selecting event type...');
    await flowPage.click('text=Casamento / Noivado');
    await flowPage.click('text=Avançar');

    // Step 5: Add-ons
    console.log('  -> Selecting addons...');
    await flowPage.click('text=Mesa de Sobremesas Nobres');
    await flowPage.click('text=Avançar');

    // Step 6: Contact info
    console.log('  -> Filling contact info...');
    await flowPage.fill('#customerName', 'Roberta Lima');
    await flowPage.fill('#customerPhone', '11988889999');
    await flowPage.fill('#customerCity', 'São Paulo');
    await flowPage.fill('#customerNeighborhood', 'Pinheiros');
    await flowPage.click('text=Ver Resumo Final');

    // Step 7: Verify Summary & WhatsApp CTA
    console.log('  -> Checking Summary Step...');
    await flowPage.waitForSelector('text=Seu evento está quase pronto');
    const hasPriceEstimate = await flowPage.isVisible('text=Estimativa Inicial');
    const hasWhatsAppButton = await flowPage.isVisible('text=Solicitar Orçamento pelo WhatsApp');

    auditReport.interactiveTests.stepperFlow = {
      success: hasPriceEstimate && hasWhatsAppButton,
      hasPriceEstimate,
      hasWhatsAppButton,
    };

    console.log(`  ✓ Stepper completed successfully. Has price estimate: ${hasPriceEstimate}, Has WhatsApp button: ${hasWhatsAppButton}`);

    await flowPage.screenshot({
      path: path.join(SCREENSHOT_DIR, 'stepper-summary-mobile.png'),
    });

    await flowContext.close();

    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, 'audit-report.json'),
      JSON.stringify(auditReport, null, 2)
    );

    console.log('\n✅ Visual audit complete. Report written to audit-screenshots/audit-report.json');
  } catch (error) {
    console.error('❌ Audit encountered an error:', error);
  } finally {
    await browser.close();
  }
}

runVisualAudit();
