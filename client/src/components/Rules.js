import React from "react";

import "./styles/Rules.css";

const Rules = () => {
    return (
        <main className="rules">
            <h1><br />Réglement de l'Épopée</h1>
            <div className="rules-section">
                <h3>Article 1 : Objet du Jeu</h3>
                <p>L’Épopée est un jeu de gestion d'équipe de cyclisme en ligne qui permet aux joueurs de créer et de gérer leur propre équipe de coureurs professionnels. Les points sont attribués en fonction des performances réelles des coureurs dans les courses professionnelles tout au long de la saison.</p>
            </div>

            <div className="rules-section">
                <h3>Article 2 : Composition de l'Équipe</h3>
                <p>
                    1. Les équipes doivent être composées de 27 à 30 coureurs.<br />
                    2. Chaque joueur dispose d'un budget de 500 points pour constituer son équipe.<br />
                    3. Les coureurs ont des valeurs allant de 3 à 99 points, basées sur leurs performances et leur réputation dans le monde du cyclisme.<br />
                    4. Les équipes peuvent être modifiées à 3 reprises à des moments clés de la saison (8 avril - 31 mai - 31 juillet) grâce à 5 transferts de coureurs.<br />
                    5. La valeur des 5 coureurs recrutés doit être inférieure ou égale aux coureurs vendus.<br />
                    6. Un coureur avec une valeur de 3 ou 4 a la possibilité d'obtenir un bonus de point pour la saison (Point multiplié par deux). Le choix ne peut être changé après le début de la saison.<br />
                    7. Les effectifs sont modifiables, tout comme le calendrier des courses et des objectifs jusqu'à la première course de la saison, le 26 janvier.
                </p>
            </div>

            <div className="rules-section">
                <h3>Article 3 : Sélection des Courses et Points</h3>
                <p>
                    1. Les coureurs sont invités sur toutes les courses WT mais doivent choisir 42 courses Pro Series et 45 continental Tour. Le but étant de faire des choix et de pousser la stratégie au maximum.<br />
                    2. Les joueurs doivent sélectionner trois courses majeures comme objectifs principaux en début de saison.<br />
                    3. Les points des coureurs sont doublés lors de ces trois courses sélectionnées, ajoutant une dimension stratégique supplémentaire.
                </p>
            </div>

            <div className="rules-section">
                <h3>Article 4 : Transferts</h3>
                <p>
                    1. Un transfert permet de remplacer un coureur de l'équipe par un autre de valeur strictement inférieure.<br />
                    2. Les managers peuvent effectuer des transferts à des moments spécifiques de la saison course précisée dans l'article 2.<br />
                    3. Les points du coureur vendus sont conservés après son départ et les points de la recrue ne sont comptés qu'à partir du lendemain de son arrivée.
                </p>
            </div>

            <div className="rules-section">
                <h3>Article 5 : Système de Points</h3>
                <p>
                    1. Les points sont attribués en fonction des performances réelles des coureurs dans les courses professionnelles.<br />
                    2. Des points supplémentaires peuvent être gagnés pour des réalisations spéciales, comme le port du maillot de leader ou des distinctions honorifiques.<br />
                    3. Les résultats sont mis à jour après chaque course dans les 24 heures après la course.
                </p>
            </div>

            <div className="rules-section">
                <h3>Article 6 : Fin de Saison</h3>
                <p>
                    1. À la fin de la saison, les équipes seront dissoutes.<br />
                    2. Une nouvelle saison implique de nouvelles équipes pour chaque manager.<br />
                </p>
            </div>

            <div className="rules-section">
                <h3>Article 7 : Vie du Jeu et Interactivité</h3>
                <p>La vie du jeu dépend de l'engagement des joueurs. Nous vous invitons à en parler au maximum sur les réseaux sociaux, sous le #EpopéeVF.</p>
            </div>

            <div className="rules-section">
                <p><strong>Note : </strong>Les règles sont susceptibles d'être ajustées pour assurer l'équité et l'amélioration de l'expérience de jeu. Les changements seront communiqués aux joueurs de manière transparente.</p>
            </div>
        </main>
    );
};

export default Rules;