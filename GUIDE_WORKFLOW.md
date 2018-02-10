## Quick Start

1. Fork BCD repo.
2. Create a new branch for each MDN page. If you don't do this each subsequent `git push` will be added to current open PR, if you have one.
3. I am using Atom as my editor. Get the `linter-jsonlint` package. You might need the lint package as a dependancy, if you don't already have it installed. This will show immediate errors, helping you learn as you go!
4. Read the BCD Readme.
5. Read the BCD Schema.
6. Google Sheet?! TBD (if this is for all contribs)
7. Open the URL.
8. Copy title.
9. I tend to duplicate an extensive JSON file as a template. In this instance I used api/RTCConfiguration.json, though you could use any to you preference. In Atom click once on the file you'll use as the template >> press `d` on your keyboard >> `Ctrl` + `v` to paste the title into the name field.
10. A useful tip from here on in: if you copy/paste the URL **first** for each subfeature (e.g. properties), filling in the subfeature's name is much easier. Atom recognizes the keyword.
11. Guide workflow:
    * paste in URL - be sure to *remove* localization from the URL (e.g. `en-US`)
    * fill in name
    * if technology article is flagged `experimental` (usually at the top of the article) switch uppermost status/experimental to `true`
    * now head to the article's legacy compat table, and reproduce the `Basic support` row to the best of your ability. I start with `Desktop` and work down the JSON file, then switch to `Mobile`, working **up** the JSON file.
    * when you have that completed this will serve as your template for all subsequent subfeatures
    * in Atom `Ctrl` + `l` (lowercase L) will fold or unfold the block of code where your cursor is places. I tend to fold all subfeatures (make sure they line up withh the uppermost `__compat`), and only unfold the sub/feature I am currently working on
    * so to a detailed review: core feature details **first** >> fold >> copy URL for first subfeature >> unfold first JSON file subfeature >> paste in URL >> remove localization >> move cursor up 2 lines to the name field >> move cursor to last character in name >> `Ctrl` + `Backspace` to delete the current name content >> enter new subfeature name (noting as you type, matching keywords will pop-up. Use up/down arrows on your keyboard to highlight the correct one and press `Tab` on your keyboard to auto-propagate the field)
12. Having only added the URL and name, fold this subfeature block, and move down the JSON file to the next one.
13. Work your way down all the expected subfeatures from the source MDN article,adding the URL and name for each. I do this first to systematically account for each entry. When you get to the compat specifics this would get very confusing if each subfeature has alternative names, browser version numbers etc.
14. Most of these JSON schemas seem to have 3 curly braces, before and after most of the core content you will be working with. If you need to add an additional subfeature, simply count 3 curly braces (including the closing brace for the `status` block) to  locate the end. Copy another subfeature in your JSON file (from the first " ahead of the name, right through to final 3 curly braces) >> add your comma after the last curly brace in that group of 3 >> hit return >> then paste in your copy.
15. Delete any surplus subfeature code blocks. Keep track of those curly braces! The rule of 3 really helps.
16. Now copy the uppermost compat data you already completed, and paste this over every subfeature's compat data.
17. Once you've done them all, alter any relevant `status` items first. Especially look out for `experimental` and `deprecated`
18. Then if the compat table has unique information for this subfeature, also alter the compat data for the subfeature accordingly. This guide will not go into more detail on `alternative_name` or `notes`: for more help on those head HERE (TBD).
19. Once you complete the JSON file, and the linter shows no errors, step into your Git terminal.
20. npm run lint <path to your JSON file> - I find this very useful to run this when you add more complicated code to your JSON file in any of the steps above. Check as you go is a good methodology, instead of putting out fires at the last minute.
21. Correct any errors until you get an all-clear.
22. `git add <path to your JSON file>`
23. `git commit -m "Add compat data for <name of the MDN article>"`
24. `git push origin <name of your branch>`
25. In your browser navigate to your git fork
26. Select the appropriate branch
27. There should now be a pull request flagged at the top. Refresh the page if not.
28. Select it and fill in the pull request. Be sure to include the URL to the MDN article. Take note of the pull request number.
29. Head back to the Google Sheet and switch the article to `PR done`.
30. Enter the pull request number.
31. Create a new branch for the next article.

TBD: Help on git fetch / git rebase
