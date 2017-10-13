Feature: Siderail

  @mobile @tablet @desktop
  Scenario: As a user I want to see a siderail
    Given I set the configLocation to "./fixtures/config/siderail.json"
    And I go to the "/m/Iyfst4Se/spotlight?list=lrYLc95e" page
    Then the siderail should be visible
    And the next up slider should be hidden

  @mobile @tablet @desktop
  Scenario: As a user I want to see the siderail title
    Given I am still on the "/m/Iyfst4Se/spotlight?list=lrYLc95e" page
    Then the siderail title should be "Next Up"

  @mobile @tablet @desktop
  Scenario: As a user I want to see 4 items in the siderail
    Given I am still on the "/m/Iyfst4Se/spotlight?list=lrYLc95e" page
    Then the siderail should contain 4 items

  @mobile @tablet @desktop
  Scenario: As a user I want to see more items in the siderail when clicking the "Show more" button
    Given I am still on the "/m/Iyfst4Se/spotlight?list=lrYLc95e" page
    When I click on the show more button
    Then the siderail should contain 8 items

  @mobile @tablet @desktop
  Scenario: As a user I don't want to see the "Show more" button when all items are visible
    Given I am still on the "/m/Iyfst4Se/spotlight?list=lrYLc95e" page
    Then the show more button should be hidden

  @mobile @tablet @desktop
  Scenario: As a user I want to see an image in the siderail item
    Given I am still on the "/m/Iyfst4Se/spotlight?list=lrYLc95e" page
    Then the image src of the 1st item in the siderail should contain "thumbs/uNXCVIsW-720.jpg"

  @mobile @tablet @desktop
  Scenario: As a user I want to see a title in the siderail item
    Given I am still on the "/m/Iyfst4Se/spotlight?list=lrYLc95e" page
    Then the title of the 1st item in the siderail should be "Touched with Fire"

  @mobile @tablet @desktop
  Scenario: As a user I want to see that the siderail updates when a different item starts playing
    Given I am still on the "/m/Iyfst4Se/spotlight?list=lrYLc95e" page
    When I start playing the next playlist item
    Then the title of the 1st item in the siderail should be "Eye in the Sky"

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to click on a siderail item
    Given I set the configLocation to "./fixtures/config/siderail.json"
    And I go to the "/m/Iyfst4Se/spotlight?list=lrYLc95e" page
    When I click the 2nd item in the siderail
    Then the page should be "/m/RKWC0dVe/eye-in-the-sky?list=lrYLc95e"
    And the title of the 1st item in the siderail should be "He Never Died"
    And the title of the 2nd item in the siderail should be "Mustang"

