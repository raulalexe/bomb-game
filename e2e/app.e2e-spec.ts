import { BombGamePage } from './app.po';

describe('bomb-game App', () => {
  let page: BombGamePage;

  beforeEach(() => {
    page = new BombGamePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
