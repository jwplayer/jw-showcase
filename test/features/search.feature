Feature: Search
  It should open the search bar when clicking the search button in the header

  @mobile @tablet @desktop
  Scenario: As a user I want to see the search bar when clicking on the search button
    Given I go to the "index" page
    When I click on the search button in the header
    Then the search bar should be visible

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to close the search bar by clicking the close button
    Given I am still on the "index" page
    When I click on the close search button
    Then the search bar should not be visible

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to close the search bar by pressing escape
    Given I am still on the "index" page
    When I click on the search button in the header
    And I click on the search input
    And I press escape
    Then the search bar should not be visible

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to search
    Given I am still on the "index" page
    When I click on the search button in the header
    And I click on the search input
    And I type "trailer" in the search input
    And I wait until the page is "/q/trailer"
    Then the search page should show 7 items
    And the page title should be "trailer - JW Showcase"

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to play a video from the search results
    Given I go to the "index" page
    When I click on the search button in the header
    And I click on the search input
    And I type "trailer" in the search input
    And I wait until the page is "/q/trailer"
    And I click on the first video in the grid overview
    And I wait until the page is "/m/Iyfst4Se/spotlight"
    Then the page should be "/m/Iyfst4Se/spotlight"

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to share the search overview by a link
    Given I go to the "/q/trailer" page
    Then the search page should show 7 items
    And the page title should be "trailer - JW Showcase"

  @mobile @tablet @desktop
  Scenario: As a user I want to be see when the search results are empty
    Given I go to the "/q/give+me+nothing" page
    Then the search page should show 0 items
    And the page title should be "give me nothing - JW Showcase"
    And the content title should be "Nothing could be found, try changing your search phrase"

  @mobile @tablet @desktop
  Scenario: As a user I don't want to see the search button when no searchPlaylist is defined
    Given I set the configLocation to "./fixtures/config/noSearch.json"
    And I go to the "index" page
    Then the search button should not be visible

  @mobile @tablet @desktop
  Scenario: As a user I want to see all videos when showcaseContentOnly is disabled
    Given I set the configLocation to "./fixtures/config/showcaseContentOnly.json"
    And I go to the "/q/trailer" page
    Then the search page should show 10 items

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to watch a video from the property when showcaseContentOnly is disabled
    Given I set the configLocation to "./fixtures/config/showcaseContentOnly.json"
    And I go to the "/m/GQlE6Rqd/2001-a-space-odyssey" page
    Then the page should be "/m/GQlE6Rqd/2001-a-space-odyssey"

  @tablet @desktop
  Scenario: As a user I want to be able to toggle in-video search
    Given I set the configLocation to "./fixtures/config/inVideoSearch.json"
    And I go to the "/q/caption" page
    When I click on the show caption matches toggle
    Then an in-video search result should be visible

  @tablet @desktop
  Scenario: As a user I want to be able to go to a page where include captions option is set in url
    Given I set the configLocation to "./fixtures/config/inVideoSearch.json"
    And I go to the "/q/caption?showCaptionMatches=true" page
    Then the include captions toggle is active

  @tablet @desktop
  Scenario: As a user I want to be able to see the number of matches in the title if include captions is active
    Given I am still on the "/q/caption?showCaptionMatches=true" page
    Then the 1st card title should include "8 matches:"

  @tablet @desktop
  Scenario: As a user I want to be able to hover the in-video search results and see the card caption change
    Given I am still on the "/q/caption?showCaptionMatches=true" page
    When I move my mouse on the 2nd card
    When I move my mouse on the 3rd in-video search element of the 2nd card
    Then the 2nd card description should be "Caption four"
