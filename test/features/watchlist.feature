Feature: Watchlist
  Users should be able to add video's to their watchlist
  It should be possible to add a video to the watchlist via the card menu
  It should be possible to remove a video from the watchlist via the card watchlist remove button
  It should be possible to remove a video from the watchlist via the card menu
  It should be possible to add a video to the watchlist via the `add to watchlist` button on the video page
  It should be possible to remove a video from the watchlist via the `remove from watchlist` button on the video page
  It should be possible to watch a video from the watchlist

  @desktop @tablet @mobile
  Scenario: Watchlist should not be visible when there are no saved videos
    Given I go to the "index" page
    When I scroll to the watchlist slider
    Then the watchlist slider should be hidden

  @desktop @tablet @mobile
  Scenario: Save video to watchlist via the card menu
    Given I am still on the "index" page
    And the browser has localStorage support
    When I scroll to the 1st "default" slider
    And I click on the card menu button of the first card in the 1st "default" slider
    And I click on the save this video button in the open card menu
    And I scroll to the watchlist slider
    Then the watchlist slider should be visible
    And the watchlist slider should contain 1 items

  @desktop @tablet @mobile
  Scenario: Unsave this video button should be visible if the item is saved in the watchlist
    Given I am still on the "index" page
    And the browser has localStorage support
    When I scroll to the 1st "default" slider
    And I click on the card menu button of the first card in the 1st "default" slider
    Then the unsave this video button should be visible in the open card menu

  @desktop @tablet @mobile
  Scenario: Unsave this video via the card menu
    Given I am still on the "index" page
    And the browser has localStorage support
    When I click on the unsave this video button in the open card menu
    And I click on the card menu button of the first card in the 1st "default" slider
    Then the save this video button should be visible in the open card menu

  @desktop @tablet @mobile
  Scenario: There should be a unsave button visible in the card top left corner
    Given I am still on the "index" page
    And the browser has localStorage support
    When I click on the save this video button in the open card menu
    Then the unsave button should be visible in the first card of the 1st "default" slider

  @desktop @tablet @mobile
  Scenario: Remove video from watchlist via the card unsave button
    Given I am still on the "index" page
    And the browser has localStorage support
    When I click on the unsave button in the first card of the 1st "default" slider
    And I scroll to the watchlist slider
    Then the watchlist slider should be hidden

  @desktop @tablet @mobile
  Scenario: Add video to watchlist via the save this video button on the video page
    Given I go to the "/list/WXu7kuaW/video/DqGECHhT" page
    And the browser has localStorage support
    When I click on the watchlist button in the video toolbar
    Then the unsave this video button should be visible in the video toolbar

  @desktop @tablet @mobile
  Scenario: Remove video from watchlist via the remove from watchlist button on the video page
    Given I am still on the "/list/WXu7kuaW/video/DqGECHhT" page
    And the browser has localStorage support
    When I click on the watchlist button in the video toolbar
    Then the add to watchlist button should be visible on the video toolbar

  @desktop @tablet @mobile
  Scenario: Watch video from the watchlist in the index page
    Given the browser has localStorage support
    And localStorage key "jwshowcase.watchlist" has the following data:
    """
    [{"mediaid": "LjBvF1FX", "feedid": "lrYLc95e"}, {"mediaid": "Iyfst4Se", "feedid": "lrYLc95e"}]
    """
    And I go to the "index" page
    When I scroll to the watchlist slider
    Then the watchlist slider should be visible
    And the watchlist slider should contain 2 items
    When I click on the first card in the watchlist slider
    Then the page should be "/list/lrYLc95e/video/Iyfst4Se/spotlight"
