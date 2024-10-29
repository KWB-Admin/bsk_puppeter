const { timeout } = require("puppeteer");
const puppeteer = require("puppeteer");
const path = require("path");
const downloadPath = path.resolve("./download");
const bsk_url = "https://clientconnect.bskassociates.com/main.aspx";
const credentials = require('./credentials.json');

(async () => {

    async function log_in_to_bsk_client() {
        var checkbox_id = "#loginCheckbox";
        var login_button = "#btnSubmit";
        var username_box = "#loginUserNameTextbox";
        var password_box = "#loginPasswordTextbox";
        var username = credentials.username;
        var password = credentials.password;
        await textbox_type(username_box, username)
        await textbox_type(password_box, password)
        await element_click(checkbox_id);
        await element_click(login_button)
      }

    async function set_results_radio_to_all() {
        var radio_id = "#woFilterSet";
        var child_id = "#woFilterSet > input[type=radio]:nth-child(4)";
        child_element_click(radio_id, child_id)
    }

    async function set_projects_radio_to_all() {
        var radio_id = "#prjFilterSet";
        var child_id = "#prjFilterSet > input[type=radio]:nth-child(6)";
        child_element_click(radio_id, child_id)
    }

    async function click_into_general_results_page() {
        var parent_id = "#pwImg0";
        var child_id = "#trPrj_0 > td:nth-child(3) > a";
        child_element_click(parent_id, child_id)
    }

    async function click_all_results_checkbox() {
        await page.waitForSelector("#tblWO");
        await page.waitForSelector("#imgCheckAllWO");
        await page.evaluate(() => document.querySelector("#imgCheckAllWO").click());
    }

    async function download_results() {
        var dropdown_select_id = "#DElstSetup";
        var dropwdown_value = "Simple Results*";
        var download_button = "#DEimgRun";

        await page.waitForSelector("#imgSSheet");
        await page.evaluate(() => document.querySelector("#imgSSheet").click());
        await dropdown_select(dropdown_select_id, dropwdown_value)
        await page.waitForSelector(
            "#dexTree > ul > li:nth-child(1) > span > span.dynatree-checkbox"
        );
        await element_click(download_button)
        await page.waitForNetworkIdle(5000);
    }

    async function element_click(element_id) {
        element = await page.waitForSelector(element_id)
        await element.click()
    }
    
    async function child_element_click(parent_id, child_id) {
        await page.waitForSelector(parent_id);
        await page.click(child_id);
    }

    async function dropdown_select(select_id, value) {
        await page.waitForSelector(select_id);
        await page.select(select_id, value);
    }

    async function textbox_type(element_id, text) {
        await page.waitForSelector(element_id)
        await page.type(element_id,text)        
    }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(0);

  await page.goto(bsk_url);

  await log_in_to_bsk_client();

  // Naviagate to Results
  await set_projects_radio_to_all();
  await click_into_general_results_page();
  await set_results_radio_to_all();
  await click_all_results_checkbox();
  
  // Download results
  await page._client().send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadPath,
  });

  await download_results();
  await browser.close();

})();
