# Extension OBS pour les segments de video youtube

Les fautes dans ce texte, c'est car c'est la merde, j'ai un BBK à prendre
Merci à Brunk_Mortel pour la query (popup.js)

## Instalation

1) Télécharger ce github (Code --> Télécharger)
2) Dezip le zip (oui)

Dans chrome/Opera...

3) Aller dans le menu extensions (extensions > Gérer les extensions)
4) Activer le mode développeur
5) Cliquer "Charger l'extension non empaquetée" et choisir le dossier de l'extension

## Utilisation

1) Créer une nouvelle instance si il n'y a pas de token déja défini
2) Copier l'url OBS

Dans OBS:

3) Créer une nouvelle source "Navigateur" avec l'url copiée (Taille recommendée 1000x150)

Sur Youtube:

4) Aller sur la video et cliquer "Start Plugin"

## Changer la couleur du text et d'autres aspects
Dans les propriétées de la source navigateur:


Titre: CSS personnalisé > Rajouter un tag css h1

Sous-Titre: CSS personnalisé > Rajouter un tag css h2


Exemple:
```css
body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }
h1 {color: rgba(235, 52, 210, 0.9); }
h2 {color: rgba(235, 52, 210, 0.9); }
```

# On peut aussi changer touts les attributs css avec cet méthode comme la police du texte
PS: Le serveur ne stocke aucune données
