---
title: Data migration
---

In DatoCMS you are free at any time you want to edit any model and field present in your administrative area. While this is great news for you, it also complicates the situation quite a bit on our part! 

Suppose you have an *Article* model, and you already have a number of articles stored. What happens to these existing articles in one of the following situations?

* You add a new mandatory field;
* You transform a non-localized field into a localized one (or viceversa);
* You add a new locale to your admin area.

Well, the existing articles are now suddenly invalid: that is, the data they contain does not respect the new schema. The way DatoCMS handles any of this situation follows these common-sense rules:

* If you add a new validation rule to a field, all the existing records will be re-checked against the new validation rules, and potentially marked as invalid;
* If a non-localized field becomes localized, the existing non-localized content becomes the content associated with the first site locale, and the other locales will be empty;
* If a localized field becomes non-localized, only the content specified for the first site locale is preserved, the others will be destroyed;
* If you remove a locale from the settings, the content of any localized field for that locale will be permanently destroyed;
* If you add a new locale in the settings, the content of any localized field for that locale will be empty.

Our APIs and static site generator plugins only return valid records, so be aware that invalid content won't be present in the final website.
