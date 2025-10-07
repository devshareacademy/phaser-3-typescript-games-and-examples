# tactiq.io free youtube transcript
# No title found
# https://www.youtube.com/watch/u64v8I0XVoo

00:00:00.000 No text
00:00:00.599 hello and welcome back to another video
00:00:02.960 in this video I'm going to show you how
00:00:04.160 to make this awesome card art inspired
00:00:06.080 by Marvel snap if you're if you've been
00:00:08.480 playing Marvel snap for a while you
00:00:10.440 might be familiar with the game or with
00:00:12.360 the card art and it's really awesome so
00:00:15.160 in this tutorial I'm going to show you
00:00:16.760 how to make your card art like this um
00:00:20.720 so what I will cover in this video is
00:00:23.720 making the hero pop you know like not
00:00:25.920 only make it on different layer and push
00:00:27.920 it forward forward but also make little
00:00:29.800 bit of a parallaxing effect on the arm
00:00:32.880 or on the hand arm and then the body
00:00:35.079 itself uh you can't really see it over
00:00:37.120 here because again it's a limited
00:00:38.640 rotation but we will see uh it on a 3D
00:00:41.160 modeling software or maybe in the Gau
00:00:42.600 itself and you know animating the frame
00:00:45.239 and also the fake parallaxing on the
00:00:47.600 background um oh I forgot to mention the
00:00:50.239 waving Cape animation and it's you know
00:00:53.280 you might be surprised it's actually
00:00:54.559 pretty easy uh how to do it and so yeah
00:00:57.280 let's just get into it all right well I
00:00:59.000 No text
00:00:59.399 think I'm going to show show you a
00:01:00.199 little bit on the modeling side of
00:01:01.719 things first so this is inside blender
00:01:04.280 so basically what you need to have is
00:01:06.479 the card itself right the card model but
00:01:09.280 so what I have here several layers of
00:01:12.600 things so in this case like the forward
00:01:14.680 one I could just make it solo so this
00:01:17.560 one is the name tag of the hero so it's
00:01:20.560 the one that is uh placed pretty up
00:01:24.079 front and then the second to that is the
00:01:25.920 frame not the frame but actually the
00:01:27.799 hero portrait right so you're going to
00:01:29.680 have hero uh portray so this is going to
00:01:32.280 be um what is it like just like a basic
00:01:35.040 uh square and but it has like uh high
00:01:37.600 resolution so I just basically
00:01:39.560 subdivided the plane several times
00:01:41.840 that's how I created this kind of um how
00:01:45.719 this like high not really high poly but
00:01:48.000 you know high
00:01:49.439 resolution uh plane and then uh the
00:01:52.759 background itself this is going to be
00:01:54.200 used for the background that is being
00:01:55.719 shown on the back of the card oh the
00:01:58.079 frame I forgot to mention also the frame
00:01:59.520 is actually a 3D model it's uh basically
00:02:01.680 a plane and then I just cut off the
00:02:03.520 middle part and make the frame of the
00:02:06.159 the edges and then yeah extrude it and
00:02:08.720 then last one is the glow back so if you
00:02:11.560 not um if you play Marvel Marvel snap
00:02:14.599 they have like the glowing effect uh on
00:02:16.440 the back of this of the cart and we need
00:02:18.519 a plane to represent that yeah you can
00:02:21.120 actually just copy the background um
00:02:23.160 what is it the
00:02:24.599 background uh plane and then scale it up
00:02:27.319 a little bit uh bigger than it should or
00:02:30.000 bigger than the default size of the
00:02:33.040 background itself so that's just
00:02:35.200 basically the model it's pretty simple
00:02:36.720 right and so let's just jump into gdau
00:02:40.000 oh yeah export these things and then
00:02:41.920 let's jump into
00:02:43.000 No text
00:02:43.319 gdau all right so we are inside gdau I
00:02:46.080 already exported the model and imported
00:02:48.239 the model to uh gdo itself so it still
00:02:51.280 have all the what is it all
00:02:54.680 the uh layers that we exported before uh
00:02:58.120 but now I just going to focus on the
00:02:59.400 heroid side itself right so the hero
00:03:01.080 itself now only have the uh transparency
00:03:03.920 on oh and by the way if you're having a
00:03:05.760 trouble with the transparency don't just
00:03:07.640 plug the color node or the color output
00:03:10.000 node to the alpha node because it's not
00:03:11.879 going to make your model or your uh
00:03:15.200 texture beit transparent but you need to
00:03:16.680 decompose it first and then you know
00:03:18.319 connect the uh W or the fourth um value
00:03:22.159 to the alpha channel here or the alpha
00:03:24.280 output here uh so that's usually you
00:03:27.120 know a problem if you are doing some
00:03:28.799 kind of a transparency
00:03:30.480 thing inside the visual Shader but
00:03:32.439 anyway it has the hero texture now but
00:03:34.720 let's compare a little bit on what we
00:03:36.480 have in the final product right so this
00:03:38.599 are the final things actually but I'm
00:03:40.280 just going to focus on the um what is it
00:03:43.879 on the hero layer here so in the hero
00:03:47.599 layer if you like rotate a little bit
00:03:49.280 like that it kind of have like that fake
00:03:51.959 par not fake parallaxing but uh
00:03:54.040 parallaxing it has like depth to it why
00:03:56.959 first of all because of there's a normal
00:03:58.799 map but we're going to go into to touch
00:04:00.560 that at the moment but yeah if we go
00:04:02.879 sideways is actually uh the model is not
00:04:05.439 just like a plain a plain plane what
00:04:08.680 like a flat plane that's what I'm trying
00:04:10.079 to say flat plane it's actually a uh a
00:04:13.319 plane with some Extrusion right
00:04:15.439 especially like in some areas here or
00:04:17.519 targeted area like the chest and then
00:04:20.000 the hand here and then the arm kind of
00:04:22.960 puding also and also you might notice
00:04:25.360 the um the Cape is waving and um so so
00:04:29.800 we are going to discuss a little bit on
00:04:31.000 No text
00:04:31.000 the displacement map itself so
00:04:32.440 displacement map usually is used to
00:04:36.199 create like uh Peaks and value on a
00:04:38.320 Terrain uh maybe you've uh seen this
00:04:40.759 method been used several time and as you
00:04:43.440 can see here like I have a plane here
00:04:45.360 and if we put like displacement map
00:04:47.440 which is a noise it will extrude certain
00:04:50.639 points that sampling the white area on
00:04:53.759 the noise and if it is sampling the
00:04:55.800 black area then it's not going to
00:04:57.400 extrude anything that's why it's kind of
00:04:58.800 like giving the Peaks and Valley uh
00:05:01.840 effects right as you might see it's kind
00:05:03.880 of like pretty low poly at the moment
00:05:05.880 you cannot really see it pretty clearly
00:05:07.800 but yeah if we add more subdivision
00:05:10.120 let's say like 15 it g it will give more
00:05:12.800 details to it and if you keep make it
00:05:15.240 higher and higher it will just you know
00:05:17.400 getting higher density higher uh or
00:05:19.600 smoother transition also so uh that's
00:05:22.680 why in the model explanation I uh showed
00:05:25.440 you that the plane for the hero layer is
00:05:27.919 actually it has a lot of uh triangles
00:05:30.720 right or a lot of uh quads it's not only
00:05:33.560 like a quad I think but it's has a lot
00:05:36.080 of quads that's why uh it needs higher
00:05:39.000 resolution than the other one uh in
00:05:41.120 terms of performance maybe there should
00:05:42.400 be a limit to that but I'm not really
00:05:43.800 sure what's the limit again I think you
00:05:45.960 need to find it on your own but
00:05:47.319 basically I think it all is kind of like
00:05:50.120 you know balanced out by the other uh
00:05:54.960 model which has it's only quads it only
00:05:57.479 has like two triangles basically right
00:05:59.840 two triangles and four vertices but yeah
00:06:03.960 and so yeah that's basically what
00:06:05.800 displacement map usually do so instead
00:06:08.400 of s sampling a noise we sample the
00:06:11.400 displacement map in form of a different
00:06:12.000 No text
00:06:13.800 texture so how do we do that let's just
00:06:16.400 uh I'm going to demonstrate that so
00:06:18.919 let's uh make a texture 2D
00:06:22.319 here's R
00:06:25.680 this
00:06:28.280 and uh bre it a little bit away like
00:06:30.880 that and then T 2D click okay and then
00:06:34.840 let's add
00:06:36.840 a um verx first and then let's multiply
00:06:43.919 that multiply or maybe not multiply add
00:06:47.680 uh Vector 3 we don't need Vector 4
00:06:50.639 because uh vertex is living in 3D space
00:06:55.039 which is it has X Y and Z and then like
00:06:58.520 that all right now everything is just
00:07:00.720 kind of like um moving to the top right
00:07:04.639 direction so we need to multiply this
00:07:07.759 one with
00:07:10.199 normal wait oh
00:07:14.280 multiply I'm going need to go like
00:07:19.120 this
00:07:21.090 [Music]
00:07:23.720 multiply and then normal
00:07:29.879 there you go now it's moving forward so
00:07:33.240 this is this normal multiplying the uh
00:07:36.000 vertex by normal or the texture by
00:07:37.720 normal it means that it will send the
00:07:40.520 texture to the direction of the normal
00:07:42.280 of the uh the plane of the model itself
00:07:44.960 right if it is a sphere then it will
00:07:46.599 protruding or extruding outwards but if
00:07:48.680 it is just a plane it will just going
00:07:50.720 forward where the plane is uh facing so
00:07:55.720 to what is it control this amount we
00:07:58.440 don't want it to be Max maimum right we
00:08:00.240 want to be able to control how much of
00:08:03.240 uh
00:08:04.599 additional um displacement we want to
00:08:06.879 have we are going to add multiply
00:08:10.680 again
00:08:12.140 [Music]
00:08:15.159 multiply with the float
00:08:17.800 parameters and call this
00:08:20.199 one displacement
00:08:23.319 amount and um connect it to connect it
00:08:27.720 to here
00:08:29.840 now it's zero right because the
00:08:31.120 displacement amount is zero now if we
00:08:33.080 you know now we can like control it for
00:08:35.120 the inspector can you see it yeah thing
00:08:37.399 right it is on top of my head so
00:08:41.159 okay now uh let's see the uh
00:08:44.720 displacement map so the displacement map
00:08:47.440 is actually just a black and white um
00:08:51.640 what is it a black and white texture
00:08:54.399 like I told you
00:08:57.320 before the texture is actually made made
00:08:59.760 inside um uh Photoshop right so like I
00:09:03.560 told you before where zero is no
00:09:06.399 Extrusion right there's no displacement
00:09:09.200 while gray here maybe 0.4 0.5 not really
00:09:13.200 sure but white it's like full Extrusion
00:09:15.160 right so uh by using this a manipulating
00:09:19.000 not manipulating I guess using a
00:09:20.399 targeted I don't know what to call it
00:09:22.240 but targeted displacement we can
00:09:24.279 displace certain body part of the
00:09:26.600 character right so in this case let's
00:09:28.279 take a look like can displace it self so
00:09:30.640 you know it has like that but now let's
00:09:34.040 say I think 0.4 I think it's too much
00:09:37.720 0.3 0
00:09:41.040 0.35 right so it's better now so now it
00:09:44.120 has that Extrusion right so and also one
00:09:47.079 thing that sold the illusion is that you
00:09:48.600 need to limit how far model or the card
00:09:52.440 can rotate right and uh you know that's
00:09:55.440 what you need to do to not break the
00:09:58.320 illusion maybe there's like some
00:10:00.240 artifacts here I mean you can like
00:10:02.040 smooth things up but think I'm too lazy
00:10:06.440 to do to do that it's just for
00:10:08.160 demonstration purposes but I think if
00:10:10.480 you could like make
00:10:12.440 the uh what is it instead of like
00:10:16.000 abruptly transition from white to black
00:10:19.800 like this where it has like um I don't
00:10:22.600 know no feather whatsoever it has
00:10:24.560 feathers it has Feathering but if you
00:10:26.800 can make it a little bit blurry or
00:10:28.079 whatever I think you can make it a
00:10:29.720 little bit smoother but this is working
00:10:31.320 for now so that's how you add the um
00:10:35.040 what is it the displacement thing so not
00:10:39.320 only you can make a Terrain like this
00:10:41.160 displacement map can be us displacement
00:10:42.839 map can be used to make like a targeted
00:10:45.880 area to be extruded right that's pretty
00:10:47.959 simple right so that's basically the
00:10:50.519 gist of making your hero good now uh it
00:10:53.000 No text
00:10:54.839 has no animation yet
00:10:57.240 because uh the cape has hav't we haven't
00:11:00.000 done anything to the C as you might not
00:11:03.160 uh note or if you understand maybe
00:11:06.519 that's such a bad statement but if you
00:11:09.000 do paying attention uh we can make a
00:11:12.800 displacement depending on the color
00:11:15.279 itself right and we can also make the
00:11:17.000 same mask so we can you do the same
00:11:19.320 thing I'm just going to copy
00:11:22.770 [Music]
00:11:24.440 this this area oops and then we're going
00:11:29.000 to make the second texture but this one
00:11:31.440 is going to be animated
00:11:34.240 and we are going to
00:11:39.600 add so we add a different texture now
00:11:42.880 which is going to be the ne the cape
00:11:44.680 mask we are going to make the mask
00:11:47.920 displaced uh additional dis add
00:11:50.240 additional displacement
00:11:51.760 too um animated
00:11:54.760 displacement with a cap sorry I need to
00:11:57.240 grab a drink okay
00:12:03.320 right and it made a displacement all
00:12:05.480 right so now we have the mask where it's
00:12:10.200 only masking the cape itself right if
00:12:12.760 you see there the cape shape right now
00:12:16.399 if we animate this by using
00:12:19.839 time oh maybe not time maybe you be
00:12:25.480 panning oh no that's not what should you
00:12:27.560 should do uh we need to add noise to
00:12:30.360 this one I forgot about that so we need
00:12:33.279 to add noise texture I think I'm going
00:12:36.120 to copy this one again uh this one is
00:12:39.680 going to be the animated
00:12:43.600 noise I don't know can yeah okay pretty
00:12:46.760 good all
00:12:49.750 [Music]
00:12:53.480 right I don't think I need this right so
00:12:58.120 multiply the noise display displacement
00:13:01.240 with the uh animated mask right with the
00:13:05.480 cape mask now that and
00:13:10.320 then like
00:13:12.360 so okay nothing happened yet why yeah
00:13:15.160 because we haven't add
00:13:16.959 anything uh let's add the scrolling uh
00:13:20.839 animation by using UV panning if you
00:13:24.079 want to understand more about the UV
00:13:25.720 panning you can go to my waterfall scene
00:13:27.920 animation uh tutorial a video where I
00:13:32.279 actually show you how to make
00:13:35.720 a um what is it UV panning uh basic and
00:13:42.160 this is actually the kind of like a
00:13:44.120 followup thing here right
00:13:50.399 um derection
00:13:54.839 right and Direction and then animated
00:13:58.279 noise so let's add a
00:14:00.680 noise texture and let's create a oops
00:14:04.959 new Fast light noise and we're going to
00:14:08.720 use cellular I mean you can use anything
00:14:10.839 you want but use your cell cellular is
00:14:13.680 working for me I'm going to invert that
00:14:16.320 and make it a little bit simpler than it
00:14:20.040 is
00:14:21.240 now
00:14:26.360 um that would work and make it seamless
00:14:29.399 right make it
00:14:30.759 seamless and then repeat to
00:14:35.560 be um
00:14:38.000 enable all right so let's see if we
00:14:41.199 still have right now we can add the
00:14:44.160 displacement only to the cape right like
00:14:46.279 this you knowbe 0 0.25
00:14:51.440 0.25 then now let's add the direction to
00:14:56.519 that maybe1 would do
00:15:00.320 it's too fast I think
00:15:02.480 mhm all right maybe add
00:15:05.839 more can make it like go to the back but
00:15:08.759 that's looks a little bit bad like that
00:15:11.839 0.4 would work I think just this
00:15:17.040 one all right so that's basically it how
00:15:19.839 to make your cape animated you know
00:15:22.240 making it um much more interesting to
00:15:25.360 look at so it's not only a static image
00:15:28.399 but also so like it has a little bit of
00:15:30.040 Animation right um should I touch on the
00:15:33.839 frame
00:15:36.440 itself okay well let's see
00:15:40.000 No text
00:15:42.079 frame um maybe not I don't this a good
00:15:47.680 idea but basically if you're uh if
00:15:49.920 you're curious on what I'm doing with
00:15:51.680 the what is it with the frame you need
00:15:55.160 to download the project on my Kofi and I
00:15:58.079 I will provide it for free so don't
00:15:59.720 worry um just download it read it for
00:16:02.800 yourself but if you want to have an
00:16:05.600 in-depth uh tutorial on the UV panning
00:16:08.319 itself go to the waterfall video uh on
00:16:12.040 my channel but I think I'm going to skip
00:16:14.480 this one but either way so that's you
00:16:17.319 make the frames I don't think I have
00:16:19.480 time brother so I'm going to skip the
00:16:21.920 frame but yeah just download the Kofi or
00:16:24.959 just download the project file on Kofi
00:16:26.600 and then yeah you know uh leave a tip
00:16:30.000 maybe I'm just joking anyway so but yeah
00:16:33.000 No text
00:16:33.160 let's take a look at the this one at the
00:16:35.519 background right if you rotate the
00:16:37.639 camera nothing really happened but if
00:16:39.079 you rotate the what is it if you rotate
00:16:41.360 the model here let's see geometry not
00:16:43.959 geometry where is it transform rotate
00:16:46.440 the model here it has like a fake
00:16:48.360 Parallax right I don't know you can see
00:16:50.120 even you can if you if it's like rotated
00:16:52.160 to the extreme you can see top part that
00:16:56.040 unseenable unseenable invisible before
00:16:59.000 but now like this you know it has like
00:17:01.279 Daily Planet so it has kind of like that
00:17:03.279 fake parallaxing
00:17:05.760 right so the way you do it is that uh
00:17:09.679 this is just the basic texturing stuff
00:17:11.640 but you go to vertex again oh I think I
00:17:14.599 not to vertex but to fragment instead of
00:17:17.000 using the animated UV you manipulate the
00:17:19.079 UV by manipulating the uh or make uh
00:17:22.359 taking the direction of the model itself
00:17:24.959 so this is the function or the notes
00:17:26.799 that I use I'm not really capable of
00:17:28.960 explaining it because I achieved this
00:17:30.640 through Brute Force sure like you know
00:17:33.840 it's basically just um experimenting
00:17:37.520 stuff so yeah it's pretty fun pretty uh
00:17:41.280 what is it interesting to achieve and so
00:17:43.840 yeah one thing that I noticed here also
00:17:46.600 is that
00:17:48.440 the you cannot achieve both I think you
00:17:51.000 cannot really achieve like by the um
00:17:53.480 what is it the camera rotation and also
00:17:55.120 the motel rotation at the same time
00:17:56.240 maybe there's a way but I don't know how
00:17:57.760 to do I'm not well versed in enough in
00:17:59.280 the the mattresses you know the the
00:18:02.080 things here but so yeah I don't
00:18:04.679 know um so basically that's how I do it
00:18:08.400 anyway I think that concludes the uh
00:18:10.000 No text
00:18:11.240 tutorial for this video and um you know
00:18:15.799 so you just made a preview animation
00:18:18.360 here and then yeah let's just see how
00:18:20.000 it's uh look on the final um I don't
00:18:23.480 think so that's my take on uh creating
00:18:26.640 the Marvel snap um card I don't know let
00:18:29.360 me know what you think down in the
00:18:30.480 comment below and uh if you are curious
00:18:32.880 on the frame itself Go download this uh
00:18:35.640 project on Kofi and you can buy other
00:18:38.080 things uh this one is going to be for
00:18:39.640 free because I don't do all the Arts I
00:18:41.400 just do the shadding and stuff so it's
00:18:42.919 free for education and um you can buy
00:18:46.880 other things in coffee to support the
00:18:49.159 channel and you know don't forget to
00:18:50.679 like And subscribe do all that jazz and
00:18:52.840 if you have questions just uh leave the
00:18:54.360 comment down below uh I'm happy to
00:18:56.200 respond to those and thank you so much
00:18:58.200 for watching my name is out see you next
00:19:01.039 time and bye
