import { TestHttpPage } from './app.po';

describe('test-http App', function() {
  let page: TestHttpPage;

  beforeEach(() => {
    page = new TestHttpPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
