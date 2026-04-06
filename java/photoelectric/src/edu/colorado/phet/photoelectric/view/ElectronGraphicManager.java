// Copyright 2002-2011, University of Colorado

/*
 * CVS Info -
 * Filename : $Source$
 * Branch : $Name$
 * Modified by : $Author: samreid $
 * Revision : $Revision: 47772 $
 * Date modified : $Date: 2011-01-07 12:53:07 -0700 (Fri, 07 Jan 2011) $
 */
package edu.colorado.phet.photoelectric.view;

import edu.colorado.phet.common.phetgraphics.view.ApparatusPanel;
import edu.colorado.phet.photoelectric.PhotoelectricConfig;
import edu.colorado.phet.photoelectric.module.PhotoelectricModule;
import edu.colorado.phet.dischargelamps.quantum.model.Electron;
import edu.colorado.phet.dischargelamps.quantum.model.ElectronSource;
import edu.colorado.phet.dischargelamps.quantum.view.ElectronGraphic;

/**
 * ElectronGraphicManager
 * <p/>
 * Creates, manages and removes ElectronGraphics
 *
 * @author Ron LeMaster
 * @version $Revision: 47772 $
 */
public class ElectronGraphicManager implements ElectronSource.ElectronProductionListener {
    private PhotoelectricModule module;

    public ElectronGraphicManager( PhotoelectricModule module ) {
        this.module = module;
    }

    public void electronProduced( ElectronSource.ElectronProductionEvent event ) {
        final ApparatusPanel apparatusPanel = module.getApparatusPanel();
        Electron electron = event.getElectron();
        final ElectronGraphic eg = new ElectronGraphic( apparatusPanel, electron );
        apparatusPanel.addGraphic( eg, PhotoelectricConfig.ELECTRON_LAYER );

        electron.addChangeListener( new Electron.ChangeListenerAdapter() {
            public void leftSystem( Electron.ChangeEvent changeEvent ) {
                apparatusPanel.removeGraphic( eg );
            }
        } );
    }
}