# צלעות ופינות

לכל צורה עם קווים ישרים יש **צלעות** (הקווים) ו**פינות** (המקומות שבהם שתי צלעות נפגשות).

```scene
type: shapes
steps:
  - text: נספור את הפינות של המשולש. נחשו כמה יהיו.
    shapes: [triangle]
  - text: אחת, שתיים, שלוש. למשולש 3 פינות.
    shapes: [triangle]
    show: corners
    label: "3"
  - text: ועכשיו את הצלעות: אחת, שתיים, שלוש. גם צלעות יש 3.
    shapes: [triangle]
    show: sides
    label: "3"
  - text: לריבוע 4 פינות.
    shapes: [square]
    show: corners
    label: "4"
  - text: ו־4 צלעות. מספר הפינות תמיד שווה למספר הצלעות.
    shapes: [square]
    show: sides
    label: "4"
```

## טיפ: לא לספור פעמיים

כשסופרים פינות, כדאי להתחיל מפינה אחת, לסמן אותה באצבע, וללכת מסביב עד שחוזרים אליה.

## צורות עם עוד פינות

```scene
type: shapes
steps:
  - text: לצורה הזו 5 פינות. קוראים לה **מחומש**.
    shapes: [pentagon]
    show: corners
    names: true
    label: "5"
  - text: ולצורה הזו 6 פינות. קוראים לה **משושה**, כמו התאים בכוורת של דבורים.
    shapes: [pentagon, hexagon]
    show: corners
    names: true
  - text: ולעיגול? אין לו אף פינה ואף צלע ישרה.
    shapes: [pentagon, hexagon, circle]
    names: true
    label: "0"
```

## לסיכום

- פינה היא המקום שבו שתי צלעות נפגשות.
- בכל צורה עם צלעות ישרות, יש אותו מספר של פינות ושל צלעות.
