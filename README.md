# Alkalmazasok_rep
##Beadandó AlkalmazásokFejlesztésére

Téma a Családi TODO. A cél egy olyan oldal volt, ahol családi tennivalókat lehet feltölteni, törölni és módosítani.
Lehessen regisztrálni és bejelentkezni. Legyen a bejelentketkezett és a nembejelentkezett felhasználónak különböző jogköre.
 {Használati eset diagramm}


##Környezet 
A weboldal szerveroldala Node.js-el készült.


##Végpontok

Az első végpont az oldal főoldala. Innen elérhető a bejelentkezés, a lista megtekintése és új listasor felvétele. Bejelentkezés oldaláról be tudunk jelentkezni, és tudunk a regisztrációs oldalra átmenni. A regisztrálás oldalról visszaléphetünk a bejelentkezés oldalára. A lista oldaláról elérhetjük az új sor feltöltését, és ha be vagyunk jelentkezve, akkor tudjuk a sorokat törölni és módosítani azokat. 

 
##Tesztelés
 
Végig lett nézve a regisztráció, hibás vagy hiányzó adatokkal, ezek esetén az oldal nem lép tovább, visszatér és a más kitöltött adatokat visszaírja és jelzést ad a hibáról.
Bejelentkezésnél hiányzó adatokkal vagy rossz név jelszó párossal nem lehet bejelentkezni. Ilyen esetekben hibaüzenetet kapunk. 
Listasor felvételénél minden mezőt ki kell tölteni, hiányzó adatokkal nem engedi feltölteni az új sort, ilyenkor hibaüzenettel tér vissza, a már beírt adatokat visszaírja.
