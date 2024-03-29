
let allupdate = []
let allmass = []
let allplanets = []
let allcount = []

//let planetid = []
let planetdistance = []
let planetx = []
let planety = []
let planetz = []
let planetvx = []
let planetvy = []
let planetvz = []
let planetv = []
let vcamera=0

let testcount=-1
let currentid=0
let currentname=''

let allx = []
let ally = []
let allz = []
let test = false
let count=0
let pcount=0
let htmlcount=0
let ispaused=0
let globaldelta=0
let timescale=6000000

let inverseconvert = function(value){
    return ((value/(1/globaldelta))*timescale)/(1.496e+11)
}

allmass.fill(0)
allplanets.fill(0)
//planetid.fill(0)
allx.fill(0)
ally.fill(0)
allz.fill(0)
planetx.fill(0)

class Star{
    constructor(mass,rotation,x,y,z,vx,vy,vz){
        this.mass=mass
        this.rotation=rotation
        this.x=x
        this.y=y
        this.z=z
        this.vx=vx
        this.vy=vy
        this.vz=vz
        
        this.draw()
        this.update()
    }

    draw(){
        let self = this
        count=count+1
        this.geometry = new THREE.SphereGeometry(0.5,32,32)
        this.material = new THREE.MeshPhongMaterial({
            map:THREE.ImageUtils.loadTexture('images/sunmap.jpg')
        })
        this.mesh = new THREE.Mesh(this.geometry,this.material)
        // console.log(this.x)
        this.mesh.position.x=this.x
        this.mesh.position.y=this.y
        this.mesh.position.z=this.z
        this.mesh.scale.multiplyScalar(2)
        allmass.push(this.mass)
        allmass.unshift(this.mass)
        allmass.pop()
        // console.log(this.mesh.position.x)
        // console.log(allmass)
    }

    update(){
        let self = this
        let resultantAx=0
        let resultantAy=0
        let resultantAz=0
        allx.push(self.x)
        ally.push(self.y)
        allz.push(self.z)
        allplanets.push(count)
        allplanets.push(0)

        allupdate.push(function(delta){
            self.mesh.rotation.y += 1/2 * delta;
            allx.unshift(self.x)
            ally.unshift(self.y)
            allz.unshift(self.z)
            allx.pop()
            ally.pop()
            allz.pop()
            self.mesh.position.x+=self.vx
            self.mesh.position.y+=self.vy
            self.mesh.position.z+=self.vz
        })
    }

    getMesh(){
        return this.mesh
    }


}

class Sun extends Star{

}

class Planet{
    constructor(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz){
        let self=this
        this.name=name
        testcount+=1
        this.rotation=rotation
        this.isplanet=isplanet
        this.mass=mass
        //this.id=testcount
        console.log(testcount)
        this.id=id
        console.log(this.id)
        /*
        while(test==false){
            console.log('test')
            if(planetid[this.id]!=null){
                ide+=1
                this.id+=1
                //planetid.push(this.id)
                console.log(pcount)
            }
            else{

                planetid.push(this.id)
                test=true
                console.log(this.id)
            }
        }
        */
        //planetid.push(pcount)
        //console.log(this.id)
        this.x=x
        this.y=y
        this.z=z
        this.vx=vx
        this.vy=vy
        this.vz=vz

        this.div=document.getElementById('infoboxd')
        this.otherdiv=document.getElementById('bottomboxd')
        this.option=document.createElement('option');
        //this.optiond=document.createElement('optiond');
        this.select=document.getElementById('changeplanet')
        
        this.affected=affect
        console.log(this.id)
        //console.log(this.isplanet)
        if(this.isplanet!=0 && this.div){
            self.distancehtml=document.createElement('p')
            self.distancehtml.innerHTML=''
            self.xposhtml=document.createElement('p')
            self.xposhtml.innerHTML=''
            self.yposhtml=document.createElement('p')
            self.yposhtml.innerHTML=''
            self.zposhtml=document.createElement('p')
            self.zposhtml.innerHTML=''
            self.vxposhtml=document.createElement('p')
            self.vxposhtml.innerHTML=''
            self.vyposhtml=document.createElement('p')
            self.vyposhtml.innerHTML=''
            self.vzposhtml=document.createElement('p')
            self.vzposhtml.innerHTML=''
            self.vhtml=document.createElement('p')
            self.vhtml.innerHTML=''
            self.div.appendChild(self.distancehtml)
            self.div.appendChild(self.xposhtml)
            self.div.appendChild(self.yposhtml)
            self.div.appendChild(self.zposhtml)
            self.div.appendChild(self.vxposhtml)
            self.div.appendChild(self.vyposhtml)
            self.div.appendChild(self.vzposhtml)
            self.div.appendChild(self.vhtml)
            this.option.text =this.name
            this.option.value=this.id
            //globaloption=this.select.value
            //this.modify.add(this.optiond)
            this.select.add(this.option);
        }
        this.draw()
        this.update()
        
        

    }

    draw(){
        let self = this
        this.geometry = new THREE.SphereGeometry(0.5,32,32)
        this.material = new THREE.MeshPhongMaterial({
            map:this.texture,
            bumpMap:this.bump,
            bumpScale:this.bumpscale,
            specularMap:THREE.ImageUtils.loadTexture('images/earthspec1k.jpg'),
            specular:new THREE.Color('grey'),
            tansparent:this.transparenty,
            opacity:this.opacitie,
            side:this.sidey
        })
        this.mesh = new THREE.Mesh(this.geometry,this.material)
        //console.log(planetx)
        self.mesh.position.x=planetx[self.id]
        //console.log(self.mesh.position.x)
        self.mesh.position.y=planety[self.id]
        self.mesh.position.z=planetz[self.id]
        
    }

    create(){
        let self = this
        this.mesh=this.planet
        console.log(this.id)
        planetx[this.id]=this.x
        planety[this.id]=this.y
        planetz[this.id]=this.z
        planetvx[this.id]=this.vx
        planetvy[this.id]=this.vy
        planetvz[this.id]=this.vz
        this.mesh.position.x=planetx[this.id]
        //console.log(self.mesh.position.x)
        this.mesh.position.y=planety[this.id]
        this.mesh.position.z=planetz[this.id]
        console.log(this.mesh.position.x)
    }

    atmosphere(){
        let self = this
        planetx[this.id]=this.x
        planety[this.id]=this.y
        planetz[this.id]=this.z
        planetvx[this.id]=this.vx
        planetvy[this.id]=this.vy
        planetvz[this.id]=this.vz
        self.mesh.position.x=planetx[this.id]
        //console.log(self.mesh.position.x)
        self.mesh.position.y=planety[this.id]
        self.mesh.position.z=planetz[this.id]
    }

    update(){
        let self = this
        let ax=0
        let ay=0
        let az=0
        let rAx=0
        let rAy=0
        let rAz=0
        let rv=0
        let radii=0
        let gravConst=6.67e-11

        let conversion = function(value){
            return ((((value)*(1/globaldelta))/timescale)*1.496e+11)
        }
        
        allupdate.push(function(delta){
            globaldelta=delta
            if(self.affected==1 && ispaused==0){
            for(let i=2; i>-1; i--){
            
            if(allz[i]>self.mesh.position.z || ally[i]>self.mesh.position.y || allx[i]>self.mesh.position.x || allplanets[1]==0){
                radii=Math.sqrt(((self.mesh.position.x-allx[i])**2)+((self.mesh.position.y-ally[i])**2)+((self.mesh.position.z-allz[i])**2))
            }
            else{
                radii=-Math.sqrt(((self.mesh.position.x-allx[i])**2)+((self.mesh.position.y-ally[i])**2)+((self.mesh.position.z-allz[i])**2))
            }
            ax=-(gravConst*(allmass[i])*self.mesh.position.x)/radii**3
            ay=-(gravConst*(allmass[i])*self.mesh.position.y)/radii**3
            az=-(gravConst*(allmass[i])*self.mesh.position.z)/radii**3
            ax=ax*timescale
            ay=ay*timescale
            az=az*timescale
            rAx+=ax
            rAy+=ay
            rAz+=az
            // console.log(self.mesh.position.x)
            // console.log(self.mesh.position.y)
            // console.log(self.mesh.position.z)
            

        }          

            self.mesh.rotation.y += self.rotation * delta;

            planetdistance[self.id]=radii

            planetvx[self.id]+=ax
            planetvy[self.id]+=ay
            planetvz[self.id]+=az

            planetx[self.id]+=planetvx[self.id]
            planety[self.id]+=planetvy[self.id]
            planetz[self.id]+=planetvz[self.id]

            self.mesh.position.x=planetx[self.id]
            self.mesh.position.y=planety[self.id]
            self.mesh.position.z=planetz[self.id]

            planetv[self.id]=Math.sqrt((planetvx[self.id])**2+(planetvy[self.id])**2+(planetvz[self.id])**2)
            
            //self.mesh.position.x+=planetvx[self.id]
            //self.mesh.position.y+=planetvy[self.id]
            //self.mesh.position.z+=planetvz[self.id]
            //planetx[self.id]=self.mesh.position.x
            //planety[self.id]=self.mesh.position.y
            //planetz[self.id]=self.mesh.position.z
            //console.log(ax)

            if(document.getElementById('play') && document.getElementById('pause') && document.getElementById('mod') && self.select){
                play.onclick = function(){
                    ispaused=0
                }

                pause.onclick = function(){
                    ispaused=1
                }

                mod.onclick = function(){
                    let changeX = document.getElementById('newxpos').value
                    let changeY = document.getElementById('newypos').value
                    let changeZ = document.getElementById('newzpos').value
                    let changeVX = document.getElementById('newvx').value
                    let changeVY = document.getElementById('newvy').value
                    let changeVZ = document.getElementById('newvz').value

                    planetx[currentid]=parseFloat(changeX)*10
                    planety[currentid]=parseFloat(changeY)*10
                    planetz[currentid]=parseFloat(changeZ)*10
                    planetvx[currentid]=inverseconvert(parseFloat(changeVX))
                    planetvy[currentid]=inverseconvert(parseFloat(changeVY))
                    planetvz[currentid]=inverseconvert(parseFloat(changeVZ))

                    if(currentname=='Earth' || currentname=='Saturn' || currentname=='Uranus'){
                        planetx[currentid+1]=parseFloat(changeX)*10
                        planety[currentid+1]=parseFloat(changeY)*10
                        planetz[currentid+1]=parseFloat(changeZ)*10
                        planetvx[currentid+1]=inverseconvert(parseFloat(changeVX))
                        planetvy[currentid+1]=inverseconvert(parseFloat(changeVY))
                        planetvz[currentid+1]=inverseconvert(parseFloat(changeVZ))
                        console.log('Works')

                        if(currentname=='Earth'){
                            planetx[currentid+2]=parseFloat(changeX)*10
                            planety[currentid+2]=parseFloat(changeY)*10
                            planetz[currentid+2]=parseFloat(changeZ)*10
                            planetvx[currentid+2]=inverseconvert(parseFloat(changeVX))
                            planetvy[currentid+2]=inverseconvert(parseFloat(changeVY))
                            planetvz[currentid+2]=inverseconvert(parseFloat(changeVZ))
                            console.log('Also works')

                        }
                    }
                    
                            //console.log('test')
                }
            

            

            
                

            if(self.isplanet!=0){
                //planetx[self.id]=self.mesh.position.x
                //planety[self.id]=self.mesh.position.y
                //planetz[self.id]=self.mesh.position.z
                //planetvx[self.id]=self.vx
                //planetvy[self.id]=self.vy
                //planetvz[self.id]=self.vz
                //console.log(self.id)
                //console.log(self.select.value)
                if(self.select.value!=self.id){
                    self.distancehtml.innerHTML=''
                    self.div.removeChild(self.distancehtml)
                    self.div.appendChild(self.distancehtml)
                    
                    self.xposhtml.innerHTML=''
                
                    self.div.removeChild(self.xposhtml)
                    self.div.appendChild(self.xposhtml)

                    self.yposhtml.innerHTML=''

                    self.div.removeChild(self.yposhtml)
                    self.div.appendChild(self.yposhtml)

                    self.zposhtml.innerHTML=''
                    
                    self.div.removeChild(self.zposhtml)
                    self.div.appendChild(self.zposhtml)

                    self.vxposhtml.innerHTML=''
                    
                    self.div.removeChild(self.vxposhtml)
                    self.div.appendChild(self.vxposhtml)

                    self.vyposhtml.innerHTML=''
                    
                    self.div.removeChild(self.vyposhtml)
                    self.div.appendChild(self.vyposhtml)
                    
                    self.vzposhtml.innerHTML=''
                    
                    self.div.removeChild(self.vzposhtml)
                    self.div.appendChild(self.vzposhtml)

                    self.vhtml.innerHTML=''

                    self.div.removeChild(self.vhtml)
                    self.div.appendChild(self.vhtml)

                }
                
                else{
                    self.distancehtml.innerHTML='Distance: ' + Math.round(planetdistance[self.id]*10)/100 + ' AU'
                    self.div.removeChild(self.distancehtml)
                    self.div.appendChild(self.distancehtml)

                    self.xposhtml.innerHTML='X Position: ' + Math.round(planetx[self.id]*10)/100 + ' AU'
                
                    self.div.removeChild(self.xposhtml)
                    self.div.appendChild(self.xposhtml)

                    self.yposhtml.innerHTML='Y Position: ' + Math.round(planety[self.id]*10)/100 + ' AU'
                
                    self.div.removeChild(self.yposhtml)
                    self.div.appendChild(self.yposhtml)

                    self.zposhtml.innerHTML='Z Position: ' + Math.round(planetz[self.id]*10)/100 + ' AU'
                
                    self.div.removeChild(self.zposhtml)
                    self.div.appendChild(self.zposhtml)

                    self.vxposhtml.innerHTML='X Velocity: ' + Math.round(conversion(planetvx[self.id])) + ' m/s'
                
                    self.div.removeChild(self.vxposhtml)
                    self.div.appendChild(self.vxposhtml)

                    self.vyposhtml.innerHTML='Y Velocity: ' + Math.round(conversion(planetvy[self.id])) + ' m/s'
                
                    self.div.removeChild(self.vyposhtml)
                    self.div.appendChild(self.vyposhtml)
                    
                    self.vzposhtml.innerHTML='Z Velocity: ' + Math.round(conversion(planetvz[self.id])) + ' m/s'
                
                    self.div.removeChild(self.vzposhtml)
                    self.div.appendChild(self.vzposhtml)

                    self.vhtml.innerHTML='Resultant Velocity ' + Math.round(conversion(planetv[self.id])) + ' m/s'

                    self.div.removeChild(self.vhtml)
                    self.div.appendChild(self.vhtml)

                    currentid=self.id
                    currentname=self.name   

                    }

                    }
        
                    }
                }
        })

        //test=false
    }

    getMesh(){
        return this.mesh
    }

}

class Mercury extends Planet{
    constructor(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz){
        super(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz)
        this.name=name
        this.id=id
        this.rotation=rotation
        this.isplanet=isplanet
        this.affected=affect
        this.planet=THREEx.Planets.createMercury()
        this.create()
        this.update()
    }
}

class Venus extends Planet{
    constructor(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz){
        super(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz)
        this.name=name
        this.id=id
        this.rotation=rotation
        this.isplanet=isplanet
        this.affected=affect
        this.planet=THREEx.Planets.createVenus()
        this.create()
        this.update()
    }
}

class Earth extends Planet{
    constructor(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz){
        super(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz)
        this.name=name
        this.id=id
        this.rotation=rotation
        this.isplanet=isplanet
        this.affected=affect
        this.planet=THREEx.Planets.createEarth()
        this.create()
        this.update()
        console.log(this.isplanet)
        console.log(this.affected)     
    }
}

class EarthCloud extends Planet{
    constructor(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz){
        super(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz)
        this.name=name
        this.id=id
        this.rotation=rotation
        this.isplanet=isplanet
        this.affected=affect
        this.planet=THREEx.Planets.createEarthCloud()
        this.create()
        this.update()
    }
    
}

class Mars extends Planet{
    constructor(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz){
        super(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz)
        this.name=name
        this.id=id
        this.rotation=rotation
        this.isplanet=isplanet
        this.affected=affect
        this.planet=THREEx.Planets.createMars()
        this.create()
        this.update()
    }
}

class Jupiter extends Planet{
    constructor(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz){
        super(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz)
        this.name=name
        this.id=id
        this.rotation=rotation
        this.isplanet=isplanet
        this.affected=affect
        this.planet=THREEx.Planets.createJupiter()
        this.create()
        this.update()
    }
}

class Saturn extends Planet{
    constructor(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz){
        super(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz)
        this.name=name
        this.id=id
        this.rotation=rotation
        this.isplanet=isplanet
        this.affected=affect
        this.planet=THREEx.Planets.createSaturn()
        this.create()
        this.update()
    }
}

class SaturnRing extends Planet{
    constructor(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz){
        super(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz)
        this.name=name
        this.id=id
        this.rotation=rotation
        this.isplanet=isplanet
        this.affected=affect
        this.planet=THREEx.Planets.createSaturnRing()
        this.create()
        this.update()
    }
}

class Uranus extends Planet{
    constructor(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz){
        super(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz)
        this.name=name
        this.id=id
        this.rotation=rotation
        this.isplanet=isplanet
        this.affected=affect
        this.planet=THREEx.Planets.createUranus()
        this.create()
        this.update()
    }
}

class UranusRing extends Planet{
    constructor(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz){
        super(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz)
        this.name=name
        this.id=id
        this.rotation=rotation
        this.isplanet=isplanet
        this.affected=affect
        this.planet=THREEx.Planets.createUranusRing()
        this.create()
        this.update()
    }
}

class Neptune extends Planet{
    constructor(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz){
        super(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz)
        this.name=name
        this.id=id
        this.rotation=rotation
        this.isplanet=isplanet
        this.affected=affect
        this.planet=THREEx.Planets.createNeptune()
        this.create()
        this.update()
    }
}

class Pluto extends Planet{
    constructor(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz){
        super(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz)
        this.name=name
        this.id=id
        this.rotation=rotation
        this.isplanet=isplanet
        this.affected=affect
        this.planet=THREEx.Planets.createPluto()
        this.create()
        this.update()
    }
}

class Atmosphere extends Planet{
    constructor(name,id,rotation,isplanet,mass,colour,affect,scale,x,y,z,vx,vy,vz){
        super(name,id,rotation,isplanet,mass,affect,x,y,z,vx,vy,vz)
        this.name=name
        this.id=id
        this.rotation=rotation
        this.isplanet=isplanet
        this.glowColour=new THREE.Color(colour)
        this.affected=affect
        this.scale=scale
        this.atmos1()
        this.atmosphere()
        this.update()
        console.log(this.affected)
        //this.atmos2()
        //this.create()
        //this.update()
    }

    atmos1(){
        this.geometry=new THREE.SphereGeometry(0.5,32,32)
        this.material=THREEx.createAtmosphereMaterial()
        this.material.uniforms.glowColor.value=this.glowColour
        this.mesh = new THREE.Mesh(this.geometry,this.material)
        this.mesh.scale.multiplyScalar(this.scale);
    }

    atmos2(){
        this.geometry	= new THREE.SphereGeometry(0.5, 32, 32)
        this.material	= THREEx.createAtmosphereMaterial()
        this.material.side	= THREE.BackSide
        this.material.uniforms.coeficient.value	= 0.4
        this.material.uniforms.power.value		= 4.0
        this.material.uniforms.glowColor.value	= this.glowColour
        this.mesh	= new THREE.Mesh(this.geometry, this.material );
        this.mesh.scale.multiplyScalar(this.scale+0.2);
    }

}

class starField{
    constructor(){
        this.texture	= THREE.ImageUtils.loadTexture('images/galaxy_starfield.png')
        this.material	= new THREE.MeshBasicMaterial({
            map	: this.texture,
            side	: THREE.BackSide
        })
        this.geometry	= new THREE.SphereGeometry(100, 32, 32)
        this.mesh	= new THREE.Mesh(this.geometry,this.material)

    }

    getMesh(){
        return this.mesh
    }

}

class Andromeda{
    constructor(){
        this.renderer = new THREE.WebGLRenderer({
            antialias:true
        })
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000 )
        // this.axes = new THREE.AxesHelper( 1000 );
        // this.scene.add( this.axes )
        this.light	= new THREE.AmbientLight( 0x888888 )
        this.scene.add( this.light )
        this.light	= new THREE.DirectionalLight( 0xcccccc, 1 )
        this.light.position.set(-1,-1,-1)
        this.scene.add( this.light )
        this.light.castShadow	= true
        this.light.shadowCameraNear	= 0.1
        this.light.shadowCameraFar	= 15
        this.light.shadowCameraFov	= 45

        this.light.shadowCameraLeft	= -1
        this.light.shadowCameraRight	=  1
        this.light.shadowCameraTop	=  1
        this.light.shadowCameraBottom= -1

        this.light	= new THREE.AmbientLight( 0x888888 )
        this.scene.add( this.light )
        this.light	= new THREE.DirectionalLight( 0xcccccc, 1 )
        this.light.position.set(1,1,1)
        this.scene.add( this.light )
        this.light.castShadow	= true
        this.light.shadowCameraNear	= 0.1
        this.light.shadowCameraFar	= 15
        this.light.shadowCameraFov	= 45

        this.light.shadowCameraLeft	= -1
        this.light.shadowCameraRight	=  1
        this.light.shadowCameraTop	=  1
        this.light.shadowCameraBottom= -1

        this.camera.lookAt(0,0,0)
        this.camera.position.z=-5

        this.light.shadowBias	= 0.001
        this.light.shadowDarkness	= 0.1

        this.light.shadowMapWidth	= 1024*2
        this.light.shadowMapHeight	= 1024*2

        this.addPlanet()

        let self = this

        self.vector = {x:0,y:0}

        document.onkeydown = function(event){
            vcamera=0.1
            if(event.keyCode === 68){
                self.vector.x+=vcamera
            }
            else if(event.keyCode === 83){
                self.vector.y-=vcamera
            }
            else if(event.keyCode === 65){
                self.vector.x-=vcamera
            }
            else if(event.keyCode === 87){
                self.vector.y+=vcamera
            }
        }
        
        document.onkeyup = function(event){
            vcamera=0
            if(event.keyCode === 68){
                self.vector.x+=vcamera
            }
            else if(event.keyCode === 83){
                self.vector.y-=vcamera
            }
            else if(event.keyCode === 65){
                self.vector.x-=vcamera
            }
            else if(event.keyCode === 87){
                self.vector.x-vcamera
            }
        }

        /*
        document.addEventListener('mousemove', function(event){
            self.vector.x	= (event.clientX/window.innerWidth ) - 0.1
            self.vector.y	= (event.clientY/window.innerHeight) - 0.1
        }, false)
        */

        if(indexlogin==0){
            allupdate.push(function(delta, now){
                self.camera.position.x += (self.vector.x*10 - (self.camera.position.x)) * (delta*3)
                self.camera.position.y += (self.vector.y*10 - self.camera.position.y) * (delta*3)
                self.camera.lookAt(0,0,0)
                return delta;
            })
        }

        allupdate.push(function(){
            self.renderer.render( self.scene, self.camera );
        })


        let lastTimeMsec= null
        requestAnimationFrame(function animate(nowMsec){
            requestAnimationFrame( animate );

            lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
            let deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
            lastTimeMsec	= nowMsec

            allupdate.forEach(function(updateFn){
                updateFn(deltaMsec/1000, nowMsec/1000)
            })
        })

    }
    
    addtoPage(){
        document.body.appendChild(this.renderer.domElement)
    }

    add(mesh, delta, update){
        let world = mesh.getMesh()
        let self = this
        self.scene.add(mesh.getMesh());
        console.log(allx)
        console.log(ally)
        console.log(allz)
        console.log(allmass)
        console.log(allplanets)
    }

    addPlanet(){
        let self = this;
        let modal = document.getElementById('myModal');
        let btn = document.getElementById('myBtn');
        let newModal = document.getElementById('newMod')
        let span = document.getElementsByClassName('close')[0];
 
        if(newModal && btn && span){
        newMod.onclick = function() {
            let massPlanet = parseFloat(document.getElementById('massvalue').value);
            let xPlanet = parseFloat(document.getElementById('xpos').value)*10;
            let yPlanet = parseFloat(document.getElementById('ypos').value)*10;
            let zPlanet = parseFloat(document.getElementById('zpos').value)*10;
            let vxPlanet = inverseconvert(parseFloat(document.getElementById('vxval').value));
            let vyPlanet = inverseconvert(parseFloat(document.getElementById('vyval').value));
            let vzPlanet = inverseconvert(parseFloat(document.getElementById('vzval').value));

            if(document.getElementById('selectpreset').value=='1'){
                console.log('Generic')
                self.add(new Planet('Generic',testcount,1/2,1,massPlanet,1,xPlanet,yPlanet,zPlanet,vxPlanet,vyPlanet,vzPlanet))
            }
            
            else if(document.getElementById('selectpreset').value=='2'){
                console.log('Mercury')
                self.add(new Mercury('Mercury',testcount,1/2,1,massPlanet,1,xPlanet,yPlanet,zPlanet,vxPlanet,vyPlanet,vzPlanet))
            }

            else if(document.getElementById('selectpreset').value=='3'){
                console.log('Venus')
                self.add(new Venus('Venus',testcount,1/2,1,massPlanet,1,xPlanet,yPlanet,zPlanet,vxPlanet,vyPlanet,vzPlanet))
            }

            else if(document.getElementById('selectpreset').value=='4'){
                console.log('Earth')
                self.add(new Earth('Earth',testcount,1/4,1,massPlanet,1,xPlanet,yPlanet,zPlanet,vxPlanet,vyPlanet,vzPlanet))
                self.add(new EarthCloud('Earth',testcount,-1/4,0,massPlanet,1,xPlanet,yPlanet,zPlanet,vxPlanet,vyPlanet,vzPlanet))
                self.add(new Atmosphere('Earth',testcount,1/4,0,massPlanet,'blue',1,1.05,xPlanet,yPlanet,zPlanet,vxPlanet,vyPlanet,vzPlanet))
            }
            
            else if(document.getElementById('selectpreset').value=='5'){
                console.log('Mars')
                self.add(new Mars('Mars',testcount,1/2,1,massPlanet,1,xPlanet,yPlanet,zPlanet,vxPlanet,vyPlanet,vzPlanet))
                //self.add(new Atmosphere(massPlanet,1,'blue',1,1,xPlanet,yPlanet,zPlanet,vxPlanet,vyPlanet,vzPlanet))

            }

            else if(document.getElementById('selectpreset').value=='6'){
                console.log('Jupiter')
                self.add(new Jupiter('Jupiter',testcount,1/2,1,massPlanet,1,xPlanet,yPlanet,zPlanet,vxPlanet,vyPlanet,vzPlanet))
            }

            else if(document.getElementById('selectpreset').value=='7'){
                console.log('Saturn')
                self.add(new Saturn('Saturn',testcount,1/2,1,massPlanet,1,xPlanet,yPlanet,zPlanet,vxPlanet,vyPlanet,vzPlanet))
                self.add(new SaturnRing('Saturn',testcount,0,0,massPlanet,1,xPlanet,yPlanet,zPlanet,vxPlanet,vyPlanet,vzPlanet))
            }

            else if(document.getElementById('selectpreset').value=='8'){
                console.log('Uranus')
                self.add(new Uranus('Uranus',testcount,1/2,1,massPlanet,1,xPlanet,yPlanet,zPlanet,vxPlanet,vyPlanet,vzPlanet))
                self.add(new UranusRing('Uranus',testcount,0,0,massPlanet,1,xPlanet,yPlanet,zPlanet,vxPlanet,vyPlanet,vzPlanet))
            }

            else if(document.getElementById('selectpreset').value=='9'){
                console.log('Neptune')
                self.add(new Neptune('Neptune',testcount,1/2,1,massPlanet,1,xPlanet,yPlanet,zPlanet,vxPlanet,vyPlanet,vzPlanet))
            }

            else if(document.getElementById('selectpreset').value=='10'){
                console.log('Pluto')
                self.add(new Pluto('Pluto',testcount,1/2,1,massPlanet,1,xPlanet,yPlanet,zPlanet,vxPlanet,vyPlanet,vzPlanet))
            }


        }
    
        

        btn.onclick = function() {
            modal.style.display = 'block';
            }
        
        span.onclick = function() {
            modal.style.display = 'none';
            }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
        }
    }
}




//simStart.add(new Atmosphere('Atmosphere',11,1/2,0,10,'blue',1,1.05,5,-1,-1,-0.001,-0.001,-0.03))
//simStart.add(new Atmosphere('Atmosphere',0,1/10,0,1,'blue',1,1.05,5,-1,-1,-0.001,-0.001,-0.03))
//simStart.add(new EarthCloud('Earth',1,-1/10,0,10,1,5,-1,-1,-0.001,-0.001,-0.03))
//simStart.add(new Earth('Earth',2,1/10,1,10,1,5,-1,-1,-0.001,-0.001,-0.03))
//self.add(new Atmosphere('Earth',0,0,massPlanet,'blue',1,1.05,xPlanet,yPlanet,zPlanet,vxPlanet,vyPlanet,vzPlanet))
//name,id,isplanet,mass,colour,affect,scale,x,y,z,vx,vy,vz
//simStart.add(new Atmosphere(10,'brown',1,1,5,-1,-1,-0.001,-0.001,-0.03))

