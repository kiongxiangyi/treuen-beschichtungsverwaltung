Prozessbeschreibung der Web-App für die Treuenbeschichtungsverwaltung:

Die Web-App für die Treuenbeschichtungsverwaltung besteht aus zwei Seiten: eine für den Wareneingang und eine andere für die Entnahme und Rückgabe von Materialien.

Um die Seiten zu besuchen, sind hier die Adressen:
1. http://localhost:3000/Wareneingang
2. http://localhost:3000/Entnahmeseite

1. **Wareneingangsprozess:**
   1. Benutzer scannen den Fertigungsauftrag.
   2. Im Hintergrund wird eine SAP-Schnittstelle ausgeführt, um den Fertigungsauftrag zu überprüfen und sicherzustellen, dass er vorhanden ist.
   3. Falls vorhanden, werden die Menge und der Beschichtungstext angezeigt. Benutzer geben die Art und Dicke der Beschichtung sowie die Anzahl der Steckbretter ein.
   4. Wenn mehr als ein Steckbrett vorhanden ist, geben die Benutzer die Menge für jedes einzelne Steckbrett ein.
   5. Nach der Bestätigung werden die Lagerplätze automatisch zugeordnet, und eine Zusammenfassung der Wareneingangsbuchungen wird angezeigt.
   6. Das E-Label leuchtet auf. Nach dem Drucken eines E-Labels verschwindet die entsprechende Buchung, bis alle E-Labels für die Buchungen gedruckt wurden.
   7. Benutzer können auch auf "Quittieren" klicken, wenn das E-Label nicht funktioniert. Beim Quittieren werden alle Buchungen durchgeführt.

2. **Entnahme- und Rückgabeprozess:**
   1. Es gibt zwei Schaltflächen "Entnahme" und "Rückgabe" für die entsprechenden Prozesse.
   2. Bei der Entnahme wählen Benutzer die Beschichtungsart und -dicke aus und klicken auf die Schaltfläche "Aufträge anzeigen". Alle Fertigungsaufträge mit Beständen werden angezeigt.
   3. Benutzer können die Menge ändern und schließlich den Fertigungsauftrag auswählen und auf "Weiter" klicken.
   4. Eine Zusammenfassung der Entnahmebuchung mit der entnommenen Menge und der Restmenge in den Lagerplätzen wird angezeigt.
   5. Das E-Label leuchtet auf. Nach dem Drucken eines E-Labels verschwindet die entsprechende Buchung, bis alle E-Labels für die Buchungen gedruckt wurden.
   6. Benutzer können auch auf "Quittieren" klicken, wenn das E-Label nicht funktioniert. Beim Quittieren werden alle Buchungen durchgeführt.
   7. Bei fehlerhaften Entnahmen können Benutzer die Schaltfläche "Rückgabe" verwenden, um den Rückgabeprozess zu starten.
   8. Der Rückgabeprozess ähnelt dem Wareneingang. Die Buchungsnummer unterscheidet sich und wird mit "2001" in der Tabelle "tblBuchungsdaten" gebucht.