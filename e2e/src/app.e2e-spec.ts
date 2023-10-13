import { browser, element, by, ElementFinder, ElementArrayFinder } from 'protractor';

const expectedH1 = 'Hospital Ranker';
const expectedTitle = `${expectedH1}`;
const targetHospital = { id: 15, name: 'Magneta' };
const targetHospitalDashboardIndex = 2;
const nameSuffix = 'X';
const newHospitalName = targetHospital.name + nameSuffix;

class Hospital {
  constructor(public id: number, public name: string) {}

  // Factory methods

  // Hospital from string formatted as '<id> <name>'.
  static fromString(s: string): Hospital {
    return new Hospital(
      +s.substring(0, s.indexOf(' ')),
      s.slice(s.indexOf(' ') + 1),
    );
  }

  // Hospital from hospital list <li> element.
  static async fromLi(li: ElementFinder): Promise<Hospital> {
    const stringsFromA = await li.all(by.css('a')).getText();
    const strings = stringsFromA[0].split(' ');
    return { id: +strings[0], name: strings[1] };
  }

  // Hospital id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<Hospital> {
    // Get hospital id from the first <div>
    const id = await detail.all(by.css('div')).first().getText();
    // Get name from the h2
    const name = await detail.element(by.css('h2')).getText();
    return {
      id: +id.slice(id.indexOf(' ') + 1),
      name: name.substring(0, name.lastIndexOf(' '))
    };
  }
}

describe('Tutorial part 6', () => {

  beforeAll(() => browser.get(''));

  function getPageElts() {
    const navElts = element.all(by.css('app-root nav a'));

    return {
      navElts,

      appDashboardHref: navElts.get(0),
      appDashboard: element(by.css('app-root app-dashboard')),
      topHospitals: element.all(by.css('app-root app-dashboard > div a')),

      appHospitalsHref: navElts.get(1),
      appHospitals: element(by.css('app-root app-hospitals')),
      allHospitals: element.all(by.css('app-root app-hospitals li')),
      selectedHospitalSubview: element(by.css('app-root app-hospitals > div:last-child')),

      hospitalDetail: element(by.css('app-root app-hospital-detail > div')),

      searchBox: element(by.css('#search-box')),
      searchResults: element.all(by.css('.search-result li'))
    };
  }

  describe('Initial page', () => {

    it(`has title '${expectedTitle}'`, async () => {
      expect(await browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, async () => {
      await expectHeading(1, expectedH1);
    });

    const expectedViewNames = ['Dashboard', 'Hospitals'];
    it(`has views ${expectedViewNames}`, async () => {
      const viewNames = await getPageElts().navElts.map(el => el!.getText());
      expect(viewNames).toEqual(expectedViewNames);
    });

    it('has dashboard as the active view', async () => {
      const page = getPageElts();
      expect(await page.appDashboard.isPresent()).toBeTruthy();
    });

  });

  describe('Dashboard tests', () => {

    beforeAll(() => browser.get(''));

    it('has top hospitals', async () => {
      const page = getPageElts();
      expect(await page.topHospitals.count()).toEqual(4);
    });

    it(`selects and routes to ${targetHospital.name} details`, dashboardSelectTargetHospital);

    it(`updates hospital name (${newHospitalName}) in details view`, updateHospitalNameInDetailView);

    it(`cancels and shows ${targetHospital.name} in Dashboard`, async () => {
      await element(by.buttonText('go back')).click();
      await browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      const targetHospitalElt = getPageElts().topHospitals.get(targetHospitalDashboardIndex);
      expect(await targetHospitalElt.getText()).toEqual(targetHospital.name);
    });

    it(`selects and routes to ${targetHospital.name} details`, dashboardSelectTargetHospital);

    it(`updates hospital name (${newHospitalName}) in details view`, updateHospitalNameInDetailView);

    it(`saves and shows ${newHospitalName} in Dashboard`, async () => {
      await element(by.buttonText('save')).click();
      await browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      const targetHospitalElt = getPageElts().topHospitals.get(targetHospitalDashboardIndex);
      expect(await targetHospitalElt.getText()).toEqual(newHospitalName);
    });

  });

  describe('Hospitals tests', () => {

    beforeAll(() => browser.get(''));

    it('can switch to Hospitals view', async () => {
      await getPageElts().appHospitalsHref.click();
      const page = getPageElts();
      expect(await page.appHospitals.isPresent()).toBeTruthy();
      expect(await page.allHospitals.count()).toEqual(9, 'number of hospitals');
    });

    it('can route to hospital details', async () => {
      await getHospitalLiEltById(targetHospital.id).click();

      const page = getPageElts();
      expect(await page.hospitalDetail.isPresent()).toBeTruthy('shows hospital detail');
      const hospital = await Hospital.fromDetail(page.hospitalDetail);
      expect(hospital.id).toEqual(targetHospital.id);
      expect(hospital.name).toEqual(targetHospital.name.toUpperCase());
    });

    it(`updates hospital name (${newHospitalName}) in details view`, updateHospitalNameInDetailView);

    it(`shows ${newHospitalName} in Hospitals list`, async () => {
      await element(by.buttonText('save')).click();
      await browser.waitForAngular();
      const expectedText = `${targetHospital.id} ${newHospitalName}`;
      expect(await getHospitalAEltById(targetHospital.id).getText()).toEqual(expectedText);
    });

    it(`deletes ${newHospitalName} from Hospitals list`, async () => {
      const hospitalsBefore = await toHospitalArray(getPageElts().allHospitals);
      const li = getHospitalLiEltById(targetHospital.id);
      await li.element(by.buttonText('x')).click();

      const page = getPageElts();
      expect(await page.appHospitals.isPresent()).toBeTruthy();
      expect(await page.allHospitals.count()).toEqual(8, 'number of hospitals');
      const hospitalsAfter = await toHospitalArray(page.allHospitals);
      // console.log(await Hospital.fromLi(page.allHospitals[0]));
      const expectedHospitals =  hospitalsBefore.filter(h => h.name !== newHospitalName);
      expect(hospitalsAfter).toEqual(expectedHospitals);
      // expect(page.selectedHospitalSubview.isPresent()).toBeFalsy();
    });

    it(`adds back ${targetHospital.name}`, async () => {
      const addedHospitalName = 'Alice';
      const hospitalsBefore = await toHospitalArray(getPageElts().allHospitals);
      const numHospitals = hospitalsBefore.length;

      await element(by.css('input')).sendKeys(addedHospitalName);
      await element(by.buttonText('Add hospital')).click();

      const page = getPageElts();
      const hospitalsAfter = await toHospitalArray(page.allHospitals);
      expect(hospitalsAfter.length).toEqual(numHospitals + 1, 'number of hospitals');

      expect(hospitalsAfter.slice(0, numHospitals)).toEqual(hospitalsBefore, 'Old hospitals are still there');

      const maxId = hospitalsBefore[hospitalsBefore.length - 1].id;
      expect(hospitalsAfter[numHospitals]).toEqual({id: maxId + 1, name: addedHospitalName});
    });

    it('displays correctly styled buttons', async () => {
      const buttons = await element.all(by.buttonText('x'));

      for (const button of buttons) {
        // Inherited styles from styles.css
        expect(await button.getCssValue('font-family')).toBe('Arial, Helvetica, sans-serif');
        expect(await button.getCssValue('border')).toContain('none');
        expect(await button.getCssValue('padding')).toBe('1px 10px 3px');
        expect(await button.getCssValue('border-radius')).toBe('4px');
        // Styles defined in hospitals.component.css
        expect(await button.getCssValue('left')).toBe('210px');
        expect(await button.getCssValue('top')).toBe('5px');
      }

      const addButton = element(by.buttonText('Add hospital'));
      // Inherited styles from styles.css
      expect(await addButton.getCssValue('font-family')).toBe('Arial, Helvetica, sans-serif');
      expect(await addButton.getCssValue('border')).toContain('none');
      expect(await addButton.getCssValue('padding')).toBe('8px 24px');
      expect(await addButton.getCssValue('border-radius')).toBe('4px');
    });

  });

  describe('Progressive hospital search', () => {

    beforeAll(() => browser.get(''));

    it(`searches for 'Ma'`, async () => {
      await getPageElts().searchBox.sendKeys('Ma');
      await browser.sleep(1000);

      expect(await getPageElts().searchResults.count()).toBe(4);
    });

    it(`continues search with 'g'`, async () => {
      await getPageElts().searchBox.sendKeys('g');
      await browser.sleep(1000);
      expect(await getPageElts().searchResults.count()).toBe(2);
    });

    it(`continues search with 'n' and gets ${targetHospital.name}`, async () => {
      await getPageElts().searchBox.sendKeys('n');
      await browser.sleep(1000);
      const page = getPageElts();
      expect(await page.searchResults.count()).toBe(1);
      const hospital = page.searchResults.get(0);
      expect(await hospital.getText()).toEqual(targetHospital.name);
    });

    it(`navigates to ${targetHospital.name} details view`, async () => {
      const hospital = getPageElts().searchResults.get(0);
      expect(await hospital.getText()).toEqual(targetHospital.name);
      await hospital.click();

      const page = getPageElts();
      expect(await page.hospitalDetail.isPresent()).toBeTruthy('shows hospital detail');
      const hospital2 = await Hospital.fromDetail(page.hospitalDetail);
      expect(hospital2.id).toEqual(targetHospital.id);
      expect(hospital2.name).toEqual(targetHospital.name.toUpperCase());
    });
  });

  async function dashboardSelectTargetHospital() {
    const targetHospitalElt = getPageElts().topHospitals.get(targetHospitalDashboardIndex);
    expect(await targetHospitalElt.getText()).toEqual(targetHospital.name);
    await targetHospitalElt.click();
    await browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

    const page = getPageElts();
    expect(await page.hospitalDetail.isPresent()).toBeTruthy('shows hospital detail');
    const hospital = await Hospital.fromDetail(page.hospitalDetail);
    expect(hospital.id).toEqual(targetHospital.id);
    expect(hospital.name).toEqual(targetHospital.name.toUpperCase());
  }

  async function updateHospitalNameInDetailView() {
    // Assumes that the current view is the hospital details view.
    await addToHospitalName(nameSuffix);

    const page = getPageElts();
    const hospital = await Hospital.fromDetail(page.hospitalDetail);
    expect(hospital.id).toEqual(targetHospital.id);
    expect(hospital.name).toEqual(newHospitalName.toUpperCase());
  }

});

async function addToHospitalName(text: string): Promise<void> {
  const input = element(by.css('input'));
  await input.sendKeys(text);
}

async function expectHeading(hLevel: number, expectedText: string): Promise<void> {
  const hTag = `h${hLevel}`;
  const hText = await element(by.css(hTag)).getText();
  expect(hText).toEqual(expectedText, hTag);
}

function getHospitalAEltById(id: number): ElementFinder {
  const spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('..'));
}

function getHospitalLiEltById(id: number): ElementFinder {
  const spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('../..'));
}

async function toHospitalArray(allHospitals: ElementArrayFinder): Promise<Hospital[]> {
  return allHospitals.map(hospital => Hospital.fromLi(hospital!));
}
