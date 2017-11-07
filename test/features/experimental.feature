Feature: Experimental

  @mobile @tablet @desktop
  Scenario: I set custom footer links
    Given I set the configLocation to "./fixtures/config/footerLinks.json"
    And I go to the "index" page
    Then the footer should contain 2 links
    And the "text" for the 1st link should be "Privacy Policy"
    And the "url" for the 1st link should be "https://www.jwplayer.com/privacy/"
    And the "text" for the 2nd link should be "Ad Choices"
    And the "url" for the 2nd link should be "https://www.jwplayer.com/privacy/#ad-choices"
