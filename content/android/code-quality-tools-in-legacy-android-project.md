Title: How to start using code quality tools in legacy Android project
Date: 2016-12-26
Category: Android
Tags: android

Code quality is important but frequently ignored aspect of application
development. It is especially important when you working on fairly large
project in a team.

When working in a team is hard to guarantee that every team member knows and
uses common set of naming conventions, formats code according to guidelines
and uses best practices applicable to android development.

To solve this problem we can use tools such as [Checkstyle][1], [FindBugs][2]
and of course [Android Lint][3]

In this post I wouldn't go into details about what every of these tools does
or how to setup them in the new project. There are a lot of great articles about
that. What I want to talk about is how to use these tools in a legacy
project that contains hundreds of Java source files and dozens of layout
resources.

##### Why
When setting up aforementioned tools we usually want two things

* Detect as much defects as possible
* Fail build if some issues were found

These two requirements are hard to meet in legacy codebase. More likely than
not when you first setup up and run *Checkstyle*, *Findbugs* and *Lint*
in the old project you get thousands of errors. It's not possible to fix all of
them at once so we have to improvise.

We can either narrow down list of analyzed defects or allow build to pass
even when there are some defects present. While this can be used as temporally
solution it is not ideal because along with old defects you now also ignore
defects introduced with new features. If the rate of cleanup of the legacy
code is less than rate of adding new features you could never catch up at all.

What we want instead is to ignore legacy code but detect as much issues as
possible in the new code.

##### Checkstyle
To achieve this with *Checkstyle* we create two separate Gradle tasks

<script src="https://gist.github.com/alapshin/2294b7d2ad7bb0869c1319003ae33d94.js"></script>

Task `checkstyleLegacy` analyzes all code, generates report with
detected issues but doesn't fail build. Meanwhile *checkstyle* task analyzes
all code except legacy and fails build if some violations were found. To ignore
legacy code we use standard *exclude* method accepting list of ANT style
patterns like

```
**/FooBar.java
```

To generate this list you can run following command from the root directory of
your project

```bash
find . -name '*.java'  -printf "**/%f\n" > checkstyle-exclude-list.txt
```

This way you get list of all java source files currently in you project and new
files added after this moment would be analyzed. Of course you can use custom logic to
generate list of patterns or even generate this list every time before running
*checkstyle* task.

##### Findbugs
Same principle applies to *FindBugs*. We create two separate Gradle tasks

<script src="https://gist.github.com/alapshin/143c44b22f11e63969a5936f8ad275e6.js"></script>

The only interesting difference (apart from different configuration options)
from *checkstyle* task is section

```groovy
doFirst {
        String[] excludedFiles = rootProject.file('checkstyle-exclude-list.txt')
        FileTree ft = fileTree("${project.projectDir}/build/intermediates/classes")
        excludedFiles.each {
            ft.exclude it.replace(".java", "*.class")
        }
        classes = files(ft.files)
}
```

Since *FindBugs* operates on class files we have to
1. Replace *.java* filename extension with *.class*
2. Add glob symbol `*` to the end of filename to exclude class files generated
for inner classes from ignored java source files

##### How to use these tasks
To use this tasks in your project you could save them in *gradle* subdirectory
as *checkstyle.gradle* and *findbugs.gradle*. Then add lines

```groovy
apply from: rootProject.file('gradle/findbugs.gradle')
apply from: rootProject.file('gradle/checkstyle.gradle')
```

to top of module-level *build.gradle* and lines to the end of root-level *build.gradle*

<script src="https://gist.github.com/alapshin/48f55ba134d9174d3fbd3405b4c9b796.js"></script>

This way this tasks will be run every time standard *check* task is run.

##### Android Lint
Starting from version 2.3.0 of *android-gradle-plugin* *lint* adds [baseline][4]
feature. To start using it you first have to tell lint where to store all
current warnings/errors

```groovy
android {
    lintOptions {
        baseline file("lint-baseline.xml") // your choice of filename/path here
    }
}
```

and run lint

```bash
./gradlew lintDebug
```

> This will run lint on the project and record all the current issues in the
> file listed above ("lint-baseline.xml" in the project directory). The set of
> current issues is called the "baseline". This is a file you'll probably want
> to check into version control.

After that *lint* will only detect new issues and ignore issues from baseline
so you can allow lint to fail the build if there is any issues detected

```groovy
android {
    lintOptions {
        abortOnError true
        baseline file("lint-baseline.xml") // your choice of filename/path here
    }
}
```

Also in documentation on tools' site there are lines

```groovy
android {
    lintOptions {
        checkAllWarnings true
        warningsAsErrors true
    }
}
```

in *lint* configuration.

Personally I don't recommend to add them. First line enables all warnings
even those that are disabled by default like *FieldGetter* that warns
against using getter methods. Second line tells *lint* to treat all warnings
as errors. In combination with *abortOnError true* this can lead to false
positives and frequently broken build. Instead I recommend to look through [list
of lint checks][5] decide which warnings should be treated as errors and raise
their severity in lint xml config. For example to treat hardcoded text as error
add to `lint.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<lint>
    <issue id="HardcodedText" severity="error"/>
</lint>
```

##### Conclusion
*Checkstyle*, *FindBugs* and *Lint* are great tools to have in your arsenal
and now you can start using them in old projects without paying upfront cost
and hopefully someday you could remove tricks mentioned in this article from
your *build.gradle* files.


[1]: http://checkstyle.sourceforge.net/
[2]: http://findbugs.sourceforge.net/
[3]: http://tools.android.com/tips/lint
[4]: http://tools.android.com/tech-docs/lint-in-studio-2-3#TOC-Creating-a-Baseline
[5]: http://tools.android.com/tips/lint-checks
