let path = require('path');

// @see http://karma-runner.github.io/1.0/config/configuration-file.html
// Pour lancer les tests : ng test
// Pour lancer les tests avec couverture de code : ng test --code-coverage --reporters=coverage-istanbul,junit
module.exports = function (config) {
  config.set({
    // Répertoire de base permettant la résolution des chemins
    basePath: '',
    // Liste des frameworks de test à utiliser
    frameworks: ['jasmine', '@angular/cli'],
    // Liste des plugins à charger
    plugins: [
      require('karma-jasmine'),
      require('karma-coverage'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-junit-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    // Nécessaire pour l'exécution des tests Jasmine
    client: { clearContext: false },
    // Liste des rapporteurs à déclencher
    reporters: ['progress', 'kjhtml', 'junit'],
    // Port utilisé par Karma
    port: 9876,
    // Couleurs dans les logs
    colors: false,
    // Niveau de log
    logLevel: config.LOG_INFO,
    // Active la surveillance des fichiers et la ré-exécution des tests en cas de modification
    autoWatch: false,
    // Execution unique des tests
    singleRun: true,
    // Le(s) browser(s) à utiliser pour les tests
    browsers: ['Chrome'],
    // Configuration pour Istanbul
    coverageIstanbulReporter: {
      // Types des rapports
      reports: ['html', 'lcovonly'],
      // Répertoire de sortie
      dir: path.join(__dirname, 'build/coverage/'),
      // if using webpack and pre-loaders, work around webpack breaking the source path
      //fixWebpackSourcePaths: true,
      //skipFilesWithNoCoverage: false
    },
    // Configuration pour Angular : mode dev
    angularCli: { environment: 'dev' },
    // Configuration pour le junit reporter
    junitReporter: { outputDir: './build/', outputFile: 'test-results.xml', useBrowserName: false, xmlVersion: '1' }
  });
};
