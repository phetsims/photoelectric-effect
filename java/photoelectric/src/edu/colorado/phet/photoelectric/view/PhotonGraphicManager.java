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

import edu.colorado.phet.common.quantum.model.Photon;
import edu.colorado.phet.common.quantum.model.PhotonEmissionListener;
import edu.colorado.phet.common.quantum.model.PhotonEmittedEvent;
import edu.colorado.phet.lasers.view.PhotonGraphic;
import edu.colorado.phet.photoelectric.PhotoelectricConfig;
import edu.colorado.phet.photoelectric.module.PhotoelectricModule;

/**
 * PhotonGraphicManager
 * <p>
 * Creates, adds and removes graphics for photons
 *
 * @author Ron LeMaster
 * @version $Revision: 47772 $
 */

/**
 */
public class PhotonGraphicManager implements PhotonEmissionListener {
    private PhotoelectricModule module;

    public PhotonGraphicManager( PhotoelectricModule module ) {
        this.module = module;
    }

    public void photonEmitted( PhotonEmittedEvent event ) {
        if( module.getPhotonViewEnabled() ) {
            Photon photon = event.getPhoton();
            final PhotonGraphic pg = PhotonGraphic.getInstance( module.getApparatusPanel(), photon );
            module.getApparatusPanel().addGraphic( pg, PhotoelectricConfig.BEAM_LAYER - 1 );

            photon.addLeftSystemListener( new Photon.LeftSystemEventListener() {
                public void leftSystemEventOccurred( Photon.LeftSystemEvent event ) {
                    module.getApparatusPanel().removeGraphic( pg );
                }
            } );
        }
    }
}
