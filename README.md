# FE NC NEWS

how to test front end works:

Start off as unlogged user, on homepage which should load by default.
Check local storage is clear.
Check that header and homepage look as they should.
Experiment with filters (perhaps navigate to login page and back to homepage to see that filters remain as they should, as user and isAuthenticated wont have changed).  
Click on article card which should navigate to the appropriate article page.
check article card looks as it should.
navigate back to homepage, and filters should have stayed the same.

(use a timer of 5 minutes for below):

Login. should navigate to homepage. check that local storage is correct, and homepage and header is correct.
experiment with filters, and then look into creating an article.
first check article fields have to be filled correctly, then post an article that (based on the article topic) shouldnt be displayed to the user based on the filter topic. change filters to see article is in articles state.
Then create an article which is displayed, and use an image url to see if this works. Filters should still be set, but such that article is now displayed.
click the article and experiment with voting (delete should be there).
voting should remain when navigating to homepage, as should filters.
delete article.
check articles by other users can be voted on, but cant be deleted.

wait for jwt to expire

click on anything that requires auth endpoint, and should be navigated to login page.
check that local storage is clear.
Repeat steps for unlogged user, after navigating to homepage by clicking on logo.

check login cant be achieved if fields not filled correctly.

Navigate to register page, and check register fields have to be filled correctly (includes cant register with existing account)

register account, and should navigate to homepage.

if local storage is correct, perhaps attempt some of the stuff from login steps, but this should work anyways. make sure you create an article, as this will be needed later.
Delete account, which should take you to register page. Check that you cant register or login with deleted account.
As unlogged user, view the article on the homepage and article page, and make sure that the author reflects the fact the author deleted their account.
