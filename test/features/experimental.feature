Feature: Experimental

  @mobile @tablet @desktop
  Scenario: I set custom footer links
    Given I set the configLocation to "./fixtures/config/experimental.json"
    Given I go to the "index" page
    Then the footer should contain 3 links
    And the "text" for the 1st link should be "Privacy Policy"
    And the "url" for the 1st link should be "https://www.jwplayer.com/privacy/"
    And the "text" for the 2nd link should be "Ad Choices"
    And the "url" for the 2nd link should be "https://www.jwplayer.com/privacy/#ad-choices"
    And the "text" for the 3rd link should be "DMCA"
    And the "url" for the 3rd link should be "https://www.jwplayer.com/dmca/"

  @mobile @tablet @desktop
  Scenario: I set a footer copyright text
    Given I set the configLocation to "./fixtures/config/experimental.json"
    And I am still on the "index" page
    Then the footer should contain the copyright text
